import { CfnOutput, Construct, StackProps, Stage } from '@aws-cdk/core';
import { springBootApiStack } from '../lib/springboot-api-stack';

export class springBootApiStage extends Stage {
  urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const service = new springBootApiStack(this, 'springBootApiSvc', {
      tags: {
        Application: 'Notebook API',
        Environment: id
      }
    });
    this.urlOutput = service.urlOutput
  }
}