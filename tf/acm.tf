/* A module for creating an ACM certificate and validating it by creating a CNAME DNS record */
module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 5.0.0"

  domain_name  = var.domain_name
  zone_id      = data.aws_route53_zone.existing-zone.zone_id

  validation_method = "DNS"

  /* If we don't wait for the validation to complete, it will not be able to be attached to the load balancer.
  Example error: "creating ELBv2 Listener...: UnsupportedCertificate: The certificate ... must have a fully-qualified domain name, 
    a supported signature, and a supported key size."  */
  wait_for_validation = true 

}
