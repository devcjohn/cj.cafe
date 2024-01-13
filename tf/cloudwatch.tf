/* Create a CloudWatch log group so we have a place to send the logs */
resource "aws_cloudwatch_log_group" "ecs" {
  name = var.ecs_log_group
}