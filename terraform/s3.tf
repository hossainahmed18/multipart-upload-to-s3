resource "aws_s3_bucket" "playground" {
  bucket = "ju-playground"
  tags = {
    Environment = "Dev"
  }
  force_destroy = true
}

resource "aws_s3_bucket_cors_configuration" "s3_playground_cors_configuration" {
  bucket = aws_s3_bucket.playground.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = [
        "http://localhost:8081"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}