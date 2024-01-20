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