terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31"
    }
  }

  required_version = ">= 1.6.5"
}

provider "aws" {
  region = "us-east-2"
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

/* A policy for creating ClowdWatch logs */
resource "aws_iam_policy" "ecs_logging" {
  name        = "ecs_logging"
  description = "Allow ECS tasks to create and write to CloudWatch Logs groups"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_logging_attachment" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = aws_iam_policy.ecs_logging.arn
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}


resource "aws_vpc" "my-vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name    = "my-vpc"
    Project = "cj-cafe"
  }
}

resource "aws_subnet" "subnet-1" {
  vpc_id     = aws_vpc.my-vpc.id
  availability_zone = "us-east-2a"
  cidr_block = "10.0.1.0/24"

  tags = {
    Name    = "subnet-1"
    Project = "cj-cafe"
  }
}

resource "aws_subnet" "subnet-2" {
  vpc_id     = aws_vpc.my-vpc.id
  availability_zone = "us-east-2b"
  cidr_block = "10.0.2.0/24" // must be different from subnet-1's cidr_block

  tags = {
    Name    = "subnet-2"
    Project = "cj-cafe"
  }
}

// Associate the Route Tables with the subnets
resource "aws_route_table_association" "subnet_1_association" {
  subnet_id      = aws_subnet.subnet-1.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "subnet_2_association" {
  subnet_id      = aws_subnet.subnet-2.id
  route_table_id = aws_route_table.public_route_table.id
}



resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic"
  description = "Allow web inbound traffic"
  vpc_id      = aws_vpc.my-vpc.id

  ingress {
    description = "HTTP (port 80)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS (port 443)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

    ingress {
    description = "ICMP (ping)"
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "allow_tls"
    Project = "cj-cafe"
  }
}

/*  
Attaching an internet gateway to the VPC is needed to allow services to access the internet
(e.g., for downloading updates or communicating with external services).
 */
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.my-vpc.id
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.my-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "public-route-table"
  }
}

/* Create a CloudWatch log group so we have a place to send the logs */
resource "aws_cloudwatch_log_group" "cj-cafe" {
  name = "/ecs/ecs-cj-cafe"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "cj-cafe-task-family"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn

  container_definitions = jsonencode([
    {
      name   = "cj-cafe-frontend-container"
      image = "devcjohn/cj-cafe:latest" /* Pull this image from Dockerhub */
      cpu    = 256
      memory = 512
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/ecs-cj-cafe"
          awslogs-region        = "us-east-2"
          awslogs-stream-prefix = "ecs"
        }
      }

    }
  ])
}

resource "aws_ecs_cluster" "my-cluster" {
  name = "my-app-cluster-name"
}

resource "aws_ecs_service" "app" {
  name            = "app"
  cluster         = aws_ecs_cluster.my-cluster.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1

  launch_type = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.subnet-1.id]
    security_groups  = [aws_security_group.allow_web.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "cj-cafe-frontend-container"
    container_port   = 80
  }

  depends_on = [aws_lb.app] // Load balancer must be set up before the service can be created
}

resource "aws_lb" "app" {
  name               = "app-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow_web.id]
  subnets            = [aws_subnet.subnet-1.id, aws_subnet.subnet-2.id]
}

resource "aws_lb_target_group" "app" {
  name     = "app-tg"
  port     = 80
  protocol = "HTTP" /* the protocol used between the load balancer and the registered targets does not need to be https */
  vpc_id   = aws_vpc.my-vpc.id
  target_type = "ip" // The default is "instance", but this must be "ip" because the task is running in "awsvpc" network mode
}

# resource "aws_lb_listener" "http-plain" {
#   load_balancer_arn = aws_lb.app.arn
#   port              = 80
#   protocol          = "HTTP"

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.app.arn
#   }
# }

resource "aws_acm_certificate" "cert" {
  domain_name       = "cj.cafe"
  validation_method = "DNS"

  lifecycle {
    /* Terraform will create the new certificate before deleting the old one.
      Terraform recommends this in their docs */
    create_before_destroy = true 
  }
}

/* A module for creating an ACM certificate and validating it by creating a DNS record */
module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 5.0.0"

  domain_name  = "cj.cafe"
  zone_id      = data.aws_route53_zone.existing-cj-cafe-zone.zone_id

  validation_method = "DNS"

  wait_for_validation = false
}


resource "aws_lb_listener" "https-secure" {
  load_balancer_arn = aws_lb.app.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = module.acm.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

/* Each time a hosted zone is created or destroyed, new name servers are assigned to the zone.
   These name servers will not match the ones required to route traffic to the domain.
   To prevent this from happening, we will not manage the zone itself with Terraform, only its properties.
   Another reason to avoid creating and destroying the zone is that it can take up to 48 hours for the new name servers to propagate.
 */
data "aws_route53_zone" "existing-cj-cafe-zone" {
  name = "cj.cafe"
}

resource "aws_route53_record" "a-record-to-load-balancer" {
  zone_id = data.aws_route53_zone.existing-cj-cafe-zone.zone_id
  name    = "cj.cafe"
  type    = "A"

  alias {
    name                   = aws_lb.app.dns_name
    zone_id                = aws_lb.app.zone_id
    evaluate_target_health = true
  }
}



# locals {
#   cert_validation_options = [for dvo in aws_acm_certificate.cert.domain_validation_options : {
#     name  = dvo.resource_record_name
#     type  = dvo.resource_record_type
#     value = dvo.resource_record_value
#   }]
# }

# resource "aws_route53_record" "cert_validation" {
#   name    = element(local.cert_validation_options, 0)["name"]
#   type    = element(local.cert_validation_options, 0)["type"]
#   zone_id = data.aws_route53_zone.existing.zone_id
#   records = [element(local.cert_validation_options, 0)["value"]]
#   ttl     = 60
# }

# resource "aws_acm_certificate_validation" "cert" {
#   certificate_arn         = aws_acm_certificate.cert.arn
#   validation_record_fqdns = [aws_route53_record.cert_validation.fqdn]
# }