/* Each time a hosted zone is created or destroyed, new name servers are assigned to the zone.
   These name servers will not match the ones required to route traffic to the domain.
   To prevent this from happening, we will not manage the zone itself with Terraform, only its properties.
   Another reason to avoid creating and destroying the zone is that it can take up to 48 hours for the new name servers to propagate.
   The zone must be manually created in the AWS console, as per the README.md instructions.
 */
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
