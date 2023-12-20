resource "aws_iam_role" "playgroundLambda_role" {
  provider = aws.iam
  name     = "playgroundLambda_role"
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
resource "aws_iam_role_policy_attachment" "playgroundLambda_policyAttachment_basicExecution" {
  role       = aws_iam_role.playgroundLambda_role.name
  provider   = aws.iam
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_lambda_function" "playground" {
  function_name    = var.lambda_to_deploy
  handler          = "index.handler"
  runtime          = var.lambda_runtime
  role             = aws_iam_role.playgroundLambda_role.arn
  source_code_hash = filebase64sha256("${path.module}/${var.lambda_to_deploy}.zip")
  filename         = "${path.module}/${var.lambda_to_deploy}.zip"
}
resource "aws_cloudwatch_log_group" "playgroundLambda_logGroup" {
  name              = "/aws/lambda/${aws_lambda_function.playground.function_name}"
  retention_in_days = 30
}
data "aws_iam_policy_document" "playgroundLambda_policyDocument_cwLogs" {
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
resource "aws_iam_policy" "playgroundLambda_policy_cwLogs" {
  provider = aws.iam
  name     = "playgroundLambda_policy_cwLogs"
  policy   = data.aws_iam_policy_document.playgroundLambda_policyDocument_cwLogs.json
}
resource "aws_iam_role_policy_attachment" "playgroundLambda_policyAttachment_cwLogs" {
  provider   = aws.iam
  role       = aws_iam_role.playgroundLambda_role.name
  policy_arn = aws_iam_policy.playgroundLambda_policy_cwLogs.arn
}

resource "aws_lambda_function_url" "playgroundLambda_functionUrl" {
  function_name      = aws_lambda_function.playground.function_name
  authorization_type = "NONE"
}