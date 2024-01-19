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