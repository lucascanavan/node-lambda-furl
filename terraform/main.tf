resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_policy" {
	name = "lambda_policy"
	role = aws_iam_role.lambda_role.id

	policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
		{
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_lambda_function_url" "url1" {
  function_name      = aws_lambda_function.node-lambda-furl.function_name
  authorization_type = "NONE"
  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["date", "keep-alive"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}

resource "aws_lambda_layer_version" "layer" {
  filename = "${path.module}/../temp/produles.zip"
  source_code_hash = filebase64sha256("${path.module}/../temp/produles.zip")
  layer_name = "node-lambda-furl-${terraform.workspace}"
  compatible_runtimes = ["nodejs16.x"]
}

resource "aws_lambda_function" "node-lambda-furl" {
	layers = [
		aws_lambda_layer_version.layer.arn
	]
	filename = "${path.module}/../temp/dist.zip"
	source_code_hash = filebase64sha256("${path.module}/../temp/dist.zip")
  function_name    = "node-lambda-furl"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs16.x"
  environment {
		variables = {
			NODE_ENV = "production"
		}
	}
}
