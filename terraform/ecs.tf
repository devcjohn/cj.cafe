
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