data "aws_iam_policy_document" "s3_files_policy_document" {
  provider = aws.iam

  statement {
    actions = [
      "s3:PutObject",
      "s3:ListBucket",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "s3_files_read_policy" {
  provider = aws.iam
  name     = "s3_files_policy"
  policy   = data.aws_iam_policy_document.s3_files_policy_document.json
}

resource "aws_iam_role_policy_attachment" "video_files_s3_files_read_policy_attachment" {
  provider   = aws.iam
  role       = aws_iam_role.sdk_v3_test.name
  policy_arn = aws_iam_policy.s3_files_read_policy.arn
}