provider "aws" {
  region = "eu-north-1"
}
provider "aws" {
  alias = "iam"
}
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.0"
    }
  }
  backend "s3" {
    bucket = "eu-north-1-dev-video-test"
    key    = "junayed/terraform/states"
    region = "eu-north-1"
  }
}