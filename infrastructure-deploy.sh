aws cloudformation create-stack --stack-name cj-cafe-stack \
--template-body file://stack.yml \
--capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
--region us-east-1 \
--parameters \
ParameterKey=ACMCertificateARN,ParameterValue=
