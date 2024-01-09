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
    Project = "cj-pro"
  }
}

resource "aws_subnet" "example_subnet" {
  vpc_id     = aws_vpc.my-vpc.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name    = "example-subnet"
    Project = "cj-pro"
  }
}

// Associate the Route Table with the subnet
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.example_subnet.id
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
    Project = "cj-pro"
  }
}

# resource "aws_instance" "app_server" {
#   ami           = "ami-06d4b7182ac3480fa" # AMIs are different in each region
#   instance_type = "t2.micro"
#   subnet_id     = aws_subnet.example_subnet.id
#   vpc_security_group_ids  = [aws_security_group.allow_web.id]

#   tags = {
#     Name = "ExampleAppServerInstance"
#     Project= "cj-pro"
#   }
# }



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
resource "aws_cloudwatch_log_group" "cj-pro" {
  name = "/ecs/ecs-cj-pro"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "cj-pro-task-family"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn

  container_definitions = jsonencode([
    {
      name   = "cj-pro-frontend-container"
      image = "devcjohn/cj.pro:latest" /* Pull this image from Dockerhub */
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
          awslogs-group         = "/ecs/ecs-cj-pro"
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
    subnets          = [aws_subnet.example_subnet.id]
    security_groups  = [aws_security_group.allow_web.id]
    assign_public_ip = true
  }

  #   load_balancer {
  #     target_group_arn = aws_lb_target_group.app.arn
  #     container_name   = "app"
  #     container_port   = 8080
  #   }
}