/* A module for creating an ACM certificate and validating it by creating a CNAME DNS record */
module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 5.0.0"

  domain_name  = var.domain_name
  zone_id      = data.aws_route53_zone.existing-zone.zone_id

  validation_method = "DNS"

  wait_for_validation = false
}
