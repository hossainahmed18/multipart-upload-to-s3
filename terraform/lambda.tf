resource "aws_iam_role" "sdk_v3_test" {
  provider = aws.iam
  name     = "sdk_v3_test"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}
resource "aws_iam_role_policy_attachment" "lambda_policy_sdk_v3_test" {
  role       = aws_iam_role.sdk_v3_test.name
  provider   = aws.iam
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_lambda_function" "sdk_v3_test" {
  function_name    = "sdk_v3_test"
  handler          = "sdk-v3-test.handler"
  runtime          = "nodejs18.x"
  role             = aws_iam_role.sdk_v3_test.arn
  source_code_hash = filebase64sha256("${path.module}/sdk-v3-test.zip")
  filename         = "${path.module}/sdk-v3-test.zip"
}




resource "aws_cloudwatch_log_group" "sdk_v3_test" {
  name              = "/aws/lambda/${aws_lambda_function.sdk_v3_test.function_name}"
  retention_in_days = 30
}
data "aws_iam_policy_document" "lambda_cw_logs" {
  provider = aws.iam
  version  = "2012-10-17"

  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["arn:aws:logs:*:*:*"]
  }
}
resource "aws_iam_policy" "policy_lambda_cw_logs" {
  provider = aws.iam
  name     = "sdk_v3_test-video_lambda-cw-logs"
  policy   = data.aws_iam_policy_document.lambda_cw_logs.json
}
resource "aws_iam_role_policy_attachment" "log_policy_sdk_v3_test" {
  provider   = aws.iam
  role       = aws_iam_role.sdk_v3_test.name
  policy_arn = aws_iam_policy.policy_lambda_cw_logs.arn
}

resource "aws_lambda_function_url" "function_url" {
  function_name      = aws_lambda_function.sdk_v3_test.function_name
  authorization_type = "NONE"
}