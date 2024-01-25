---
title: Migrating from Netlify to AWS ECS
date: 2024-1-17
tags: AWS, ECS, Terraform, Docker, Netlify
---

# Migrating from Netlify to AWS ECS

### Charles Johnson, Software Engineer

#### 1-17-2023

---

<p align="center">
  <img src="./../img/Arch_Amazon-Elastic-Container-Service_64@5x.png" width="200" title="AWS Elastic Container Service Logo"/>
</p>

Over the last few days, I’ve been moving this website (the one you’re on right now!) from Netlify to Amazon Web Services (AWS). This site is currently a frontend-only React site using Vite as its build tool. The outputs are static assets including an index.html file, bundled JS files, and image files. Netlify is great for hosting a site like this because you can just point it at a GitHub repo and it will automatically build and deploy your code. But I wanted to get some more experience with AWS, Terraform, and Docker under my belt.

My requirements for the project were:

- Use Docker to containerize the app
- Use AWS and more specifically ECS (Elastic Container Service) to host the site
- Use Terraform to manage the AWS infrastructure
- The site works the same as before and is accessible at my domain name

Having previously used Terraform in production work projects, I understand it can improve the automation, visibility, accuracy, and repeatability of cloud infrastructure setups. As for ECS, while there are alternative ways to deploy the site on AWS I wanted to get more experience with this technology.

Here is a log of the steps I took and the results.

## Dockerizing the app

Before, I didn’t have to worry about configuring a server because Netlify abstracted that away. But if I want the site to run in a Docker container, a web server is needed. Vite is a great build tool, but it doesn’t include a production server for hosting its outputs. So I decided to use one of the most popular and trusted web servers: Nginx. For this, we just need a configuration file that tells Nginx where to find the static assets.

```nginx:nginx.conf
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri /index.html;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

Next, I created a Dockerfile to build and host the app:

```docker:Dockerfile
# Step 1: Build the application
FROM node:20.10 as build

# Set the working directory in the container
WORKDIR /app

# Copy files from the project into the container
COPY package*.json ./
COPY public/ public/
COPY src/ src/

# Install packages specified in package.json
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the application
FROM nginx:alpine

# Copy the nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Open port to the outside world
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

I built and tested the image locally and it worked great.

```
docker build . -t cj-cafe:1.0
docker run -p 80:80 --name cj-cafe-container cj-cafe:1.0
```

Finally, I tagged and pushed the image to Docker Hub, which allows us to pull down the image and run it on ECS.

```
docker tag cj-cafe:1.0 devcjohn/cj-cafe:1.0
docker push devcjohn/cj-cafe:1.0
```

An alternative to DockerHub is Amazon Elastic Container Repository (ECR), but I didn’t want to have to program around a small problem: Terraform doesn’t want to destroy an ECR repo with images inside it, so tearing down and rebuilding the AWS infrastructure would require extra logic.

## Installing Configuring Terraform

First I installed the Terraform and AWS CLIs.
Then I created an IAM user with admin privileges using the AWS Management Console.
Next, I created CLI access keys for that user, ran **aws configure**, and entered those keys.
This allows Terraform to authenticate with AWS.

I created a directory for my Terraform files and created the first file **main.tf.** Later I split this file into several different ones, but I'll only be showing you the final files in this blog post for brevity. If you are starting a new Terraform project you may want to consider what your final file structure will look like and begin programming using that structure. Refactoring Terraform files can be more difficult than standard code because of the way Terraform tracks state. See [Here](https://developer.hashicorp.com/terraform/language/modules/develop/refactoring) for more information on Terraform refactoring.

## Providers and Variables

Terraform works with many different cloud providers including Azure and Google Cloud, but we just need to add 'hashicorp/aws' as a provider. I set the region to 'us-east-2' since it's the closest to me and the people who are likely to visit it.

```hcl:providers.tf
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
  region = var.region

  # These tags will be applied to all resources in this project
  default_tags {
    tags = {
      Project = var.domain_tag
    }
  }
}
```

A variables file is a common strategy for storing values that may change between environments and are accessed by multiple other Terraform files.

```hcl:variables.tf
variable "region" {
  type        = string
  description = "AWS region"
  default     = "us-east-2"
}

variable "domain_name" {
  type        = string
  description = "The domain name the app is accessable from"
  default     = "cj.cafe"
}

variable "domain_tag" {
  type        = string
  description = "The domain name with a dash instead of a dot"
  default     = "cj-cafe"
}

variable "ecs_log_group" {
  type        = string
  description = "CloudWatch log group name"
  default     = "ecs/esc-cj-cafe"
}

variable "docker_image" {
  type        = string
  description = "Docker image to deploy"
  default     = "devcjohn/cj-cafe:1.0"
}
```

## VPC

The meat of terraform code is the resource block. Each one creates a resource in AWS.
I started with a VPC (Virtual Private Cloud) as it is required to allow traffic into and out of AWS.
I created a security group to allow in web traffic, and to allow services in the VPC to egress on any port.
I also added an internet gateway so the app can communicate with the internet outside of AWS.
Later I added a security group to allow traffic from the load balancer to the ECS service, which we will cover in a later step.

```hcl:vpc.tf
resource "aws_vpc" "my-vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "my-vpc"
  }
}

resource "aws_subnet" "subnet-1" {
  vpc_id            = aws_vpc.my-vpc.id
  availability_zone = "us-east-2a"
  cidr_block        = "10.0.1.0/24"

  tags = {
    Name = "subnet-1"
  }
}

resource "aws_subnet" "subnet-2" {
  vpc_id            = aws_vpc.my-vpc.id
  availability_zone = "us-east-2b"
  cidr_block        = "10.0.2.0/24" # must be different from subnet-1's cidr_block

  tags = {
    Name = "subnet-2"
  }
}

# Associate the Route Tables with the subnets
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
    Name = "allow_tls"
  }
}

# A security group is needed to allow the Load Balancer to access the ECS service.
# We want all traffic to the ECS service to come from the Load Balancer
resource "aws_security_group" "allow_traffic_from_lb" {
  name        = "allow_traffic_from_lb"
  description = "Allow traffic from the Load Balancer to ECS service"
  vpc_id      = aws_vpc.my-vpc.id

  ingress {
    description     = "Allow traffic from the Load Balancer on HTTP"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.allow_web.id]
  }

  ingress {
    description     = "Allow traffic from the Load Balancer on HTTPS"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.allow_web.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


# Attaching an internet gateway to the VPC is needed to allow services to access the internet
# (e.g., for downloading updates or communicating with external services).
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
```

## IAM

AWS IAM (Identity and Access Management) is used to create roles and policies. These specify permissions for AWS services and users.
The file below creates permissions and roles that allow the ECS service to run and to write to Cloudwatch logs.
The ssm_session_manager policy allows us to remote into the container.

```hcl:iam.tf
# A policy for allowing ECS to assume a role
data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# Allow ECS to assume the built-in "ecsTaskExecutionRole"
resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

# A policy for creating ClowdWatch logs
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

# A role allowing us to remote into the container and run commands
resource "aws_iam_policy" "ssm_session_manager" {
  name        = "ssm_session_manager"
  description = "Allow tasks to use AWS Systems Manager Session Manager"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

# Attach the policies to the role
resource "aws_iam_role_policy_attachment" "ecs_logging_attachment" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = aws_iam_policy.ecs_logging.arn
}

resource "aws_iam_role_policy_attachment" "ssm_session_manager_attachment" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = aws_iam_policy.ssm_session_manager.arn
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
```

## ECS

For ECS, I specify a single cluster with a single service with a single task. That task is what runs the image in a container. I decided to use AWS Fargate so that some of the more tedious minutiae around managing servers and clusters are automated away. I also chose to use the smallest amount of CPU and RAM, which is more than enough for hosting a static site. Later I added resources to allow the service to autoscale, or in other words, to add more instances of the task when the CPU utilization is high.

```hcl:ecs.tf

resource "aws_ecs_task_definition" "app" {
  family                   = "webapp-task-family"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512  #.5 vCPU
  memory                   = 1024 # 1 GB
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
  task_role_arn            = aws_iam_role.ecsTaskExecutionRole.arn

  container_definitions = jsonencode([
    {
      name   = "frontend-container"
      image  = var.docker_image # Pulled from Dockerhub
      cpu    = 256              #.25 vCPU
      memory = 512              # .5 GB
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = var.ecs_log_group
          awslogs-region        = "us-east-2"
          awslogs-stream-prefix = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http:#localhost/ || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 0
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

  # 1 instance to start
  desired_count = 1

  # Allows external changes (autoscaling) without Terraform plan difference
  lifecycle {
    ignore_changes = [desired_count]
  }

  launch_type = "FARGATE"

  # Allows us to remote into the container and run commands
  enable_execute_command = true

  network_configuration {
    subnets         = [aws_subnet.subnet-1.id]
    security_groups = [aws_security_group.allow_traffic_from_lb.id]
    # Without a public IP, the task cannot communicate with the internet.
    # Because the security group only allows inbound traffic from the load balancer, this is safe.
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "frontend-container"
    container_port   = 80
  }

  # The Load balancer must be set up before the service can be created
  depends_on = [aws_lb.app]
}

# Allow up to 2 tasks to run in the service
resource "aws_appautoscaling_target" "ecs_service" {
  max_capacity       = 2
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.my-cluster.id}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Combines with the above resource to scale up the service when CPU utilization is high
resource "aws_appautoscaling_policy" "scale_up" {
  name               = "scale_up"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_service.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_service.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_service.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value       = 80.0 # Add more capacity when CPU utilization is above 80%
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}
```

## Load Balancer

The load balancer directs traffic to and from the ECS cluster/service/container and is a convenient place to point traffic going to my domain. I created a target group for the load balancer to send traffic to, plus a listener to direct the traffic. I also created an SSL certificate using AWS Certificate Manager (ACM) and attached it to the load balancer. This allows the site to be accessed via HTTPS. The creation of this certificate is done in the next section.

```hcl:load_balancer.tf
resource "aws_lb" "app" {
  name               = "app-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow_web.id]
  subnets            = [aws_subnet.subnet-1.id, aws_subnet.subnet-2.id]
}

resource "aws_lb_target_group" "app" {
  name = "app-tg"
  port = 80

  # the protocol used between the load balancer and the registered targets does not need to be https
  # This is a common strategy called "SSL termination", and it is common to terminal ssl at the load balancer.
  protocol = "HTTP"
  vpc_id   = aws_vpc.my-vpc.id

  # The default target_type is "instance", but this must be "ip" because the task is running in "awsvpc" network mode
  target_type = "ip"
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
```

## ACM (Amazon Certificate Manager)

My domain was not transferable to AWS Route53 because it is a “premium” domain. Nonetheless, it is still possible to route traffic to AWS by using AWS name servers. I simply had to create a Route53 Hosted Zone for the domain, grab the name servers for it, and paste them into my domain register’s website.
Additionally, I created, validated, and assigned a certificate to allow my website to be accessible over HTTPS instead of just HTTP.

I used the **acm-certificate** module to accomplish this A terraform module is a bundle of functionality, and you can find many that are written for AWS [Here](https://registry.terraform.io/namespaces/terraform-aws-modules). Using this module allowed me to write one module code block instead of 3+ resource blocks. The next time I work with Terraform I will be on the lookout for more opportunities to use modules since they require less code and are more declarative.

```hcl:acm.tf
# A module for creating an ACM cert and validating it by creating a CNAME DNS record
module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 5.0.0"

  domain_name = var.domain_name
  zone_id     = data.aws_route53_zone.existing-zone.zone_id

  validation_method = "DNS"

  # If we don't wait for the validation to complete, it will not be able to be attached to the load balancer.
  # Example error: "creating ELBv2 Listener...: UnsupportedCertificate: The certificate ... must have a fully-qualified domain name,
  # a supported signature, and a supported key size."
  wait_for_validation = true
}
```

## DNS (Domain Name System)

I created the Route53 Hosted Zone outside of Terraform because each time a hosted zone is created or destroyed new name servers are assigned. These name servers will not match the ones required to route traffic to the domain. Another reason to avoid creating and destroying the zone is that it can take up to 48 hours for the new name servers to propagate, Below we create an A record that directs traffic from the domain to the load balancer.

```hcl:dns.tf
data "aws_route53_zone" "existing-zone" {
  name = var.domain_name
}

resource "aws_route53_record" "a-record-to-load-balancer" {
  zone_id = data.aws_route53_zone.existing-zone.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.app.dns_name
    zone_id                = aws_lb.app.zone_id
    evaluate_target_health = true
  }
}
```

## Cloudwatch

Cloudwatch is a service that monitors AWS resources. Here I am creating a log group
for the ECS service to send its output. If you revisit **ecs.tf**, you will see this log group referenced.
Cloudwatch logging is technically optional, but having visibility into the app's output is helpful for debugging.

```hcl:cloudwatch.tf
# Create a CloudWatch log group so we have a place to send ECS logs
resource "aws_cloudwatch_log_group" "ecs" {
  name = var.ecs_log_group
}
```

## Setup and Teardown

As I was adding terraform resource code, I continuously ran these commands to ensure everything was working as expected:

```
// Stand up infrastructure
terraform apply

// Tear down infrastructure
terraform destroy
```

Terraform apply and destroy take four to five minutes each.

## Autoscaling Testing

After creating all the above resources, my website was fully accessible, but I hadn't tested the autoscaling functionality.
On average, the container uses less than 1% of its maximum allocated CPU, and less than 3% of its allocated memory. Even visiting the site on multiple devices at the same time, I was unable to get the CPU utilization to spike. So to test that the autoscaling was working, I ran these commands

```
# Remote into container
aws ecs execute-command --region us-east-2 --cluster {cluster_name} --task {taskId} --container frontend-container --command "sh" --interactive

# Cause CPU spike
dd if=/dev/zero of=/dev/null**
```

This infinitely copies zero-value bytes from /dev/zero to /dev/null, causing the CPU to spike to 100% utilization. I stopped the process after a few seconds.
On the AWS ECS dashboard, I saw that a second instance of the container had been created. It was torn down after a few minutes because the CPU utilization dropped back down to normal levels. This test proves that autoscaling is working as expected.

Just for fun, here's what that spike looked like
![Graph showing CPU usage spike](./../img/ecs-cpu-spike.png 'CPU usage spike')

## Costs

Here's a cost breakdown of the project so far:

- Amazon Elastic Container Service $7.39
- Amazon Elastic Load Balancing $3.67
- Amazon Route 53 $2.52
- AWS Config $1.98
- Others $1.44

Compared to Netlify's free hosting, this is a lot, but I believe it's worth it to have gained more experience with AWS, Terraform, and Docker.
This solution may make more sense for a website with more traffic, or that can make use of microservices. I expect the costs may come down now that I'm not actively developing and therefore destroying and recreating hundreds of AWS resources every day. But I'd recommend anyone moving a static site to AWS consider alternatives like S3, as it would be cheaper.

## Conclusions

- Terraform proves a useful tool for adding automation, visibility, accuracy, and repeatability to cloud infrastructure setups
- Terraform is well-documented and supported; there are plenty of tutorials and resources to help you get started and to help you troubleshoot as needed.
- Terraform, and cloud service management in general, is complex, and standing up infrastructure may require a lot of trial and error. My main holdups were forgetting various roles, policies, and security groups. Terraform's error messages can sometimes be opaque and will require some googling to figure out what's wrong.

## PS

If you are interested in replicating my setup or learning more about this site, you might want to check the current latest versions of my code on Github [here](https://github.com/devcjohn/cj.cafe)
