import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as SpringbootApiPipelineCdk from '../lib/springboot-api-pipeline-cdk-stack';

test('Empty Stack', () => {
  //const app = new cdk.App();
  // WHEN
  //const stack = new SpringbootApiPipelineCdk.SpringbootApiPipelineCdkStack(app, 'MyTestStack',{
    //env: { account: 'x' , region: 'ap-southeast-1' }
  //});
  // THEN
  //expectCDK(stack).to(matchTemplate({
    //"Resources": {}
  //}, MatchStyle.EXACT))
});
