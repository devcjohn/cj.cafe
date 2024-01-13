
resource "aws_ecs_task_definition" "app" {
  family                   = "webapp-task-family"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn

  container_definitions = jsonencode([
    {
      name   = "frontend-container"
      image =  var.docker_image /* Pulled from Dockerhub */
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
          awslogs-group         = var.ecs_log_group
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
    container_name   = "frontend-container"
    container_port   = 80
  }

  depends_on = [aws_lb.app] // Load balancer must be set up before the service can be created
}