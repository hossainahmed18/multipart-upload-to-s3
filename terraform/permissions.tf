data "aws_iam_policy_document" "playWith_s3_policyDocument" {
  provider = aws.iam

  statement {
    actions = [
      "s3:PutObject",
      "s3:ListBucket",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "playWith_s3_policy" {
  provider = aws.iam
  name     = "playWith_s3_policy"
  policy   = data.aws_iam_policy_document.playWith_s3_policyDocument.json
}

resource "aws_iam_role_policy_attachment" "playWith_s3_policyAttachment" {
  provider   = aws.iam
  role       = aws_iam_role.playgroundLambda_role.name
  policy_arn = aws_iam_policy.playWith_s3_policy.arn
}