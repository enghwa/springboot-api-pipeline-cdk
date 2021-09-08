# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template



npm install @aws-cdk/pipelines @aws-cdk/pipelines @aws-cdk/aws-ec2 @aws-cdk/aws-ecs @aws-cdk/aws-ecs-patterns @aws-cdk/aws-rds @aws-cdk/aws-secretsmanager --save

```
Finally, add the @aws-cdk/core:newStyleStackSynthesis feature flag to the new project's cdk.json file. The file will already contain some context values; add this new one inside the context object if it's not already there.

    "@aws-cdk/core:newStyleStackSynthesis": true
```


npx cdk bootstrap aws://????????????/ap-southeast-1 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://????????????/ap-southeast-1 
export CDK_NEW_BOOTSTRAP=1
