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
      Project = "cj-cafe"
    }
  }
}