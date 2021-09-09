// import * as cdk from '@aws-cdk/core';

// export class SpringbootApiPipelineCdkStack extends cdk.Stack {
//   constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     // The code that defines your stack goes here
//   }
// }
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';
import * as pipelines from '@aws-cdk/pipelines';
import { springBootApiStage } from '../lib/springboot-api-stage';


export class SpringbootApiPipelineCdkStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const sourceArtifact = new cp.Artifact();
        const cloudAssemblyArtifact = new cp.Artifact();

        const sourceAction = new cpa.GitHubSourceAction({
            actionName: 'GitHub',
            output: sourceArtifact,
            oauthToken: SecretValue.secretsManager('github-token'),
            owner: 'enghwa',
            repo: 'springboot-api-pipeline-cdk',
            branch: 'main'
        });

        const synthAction = pipelines.SimpleSynthAction.standardNpmSynth({
            sourceArtifact,
            cloudAssemblyArtifact,
            buildCommand: 'npm run build && npm test',
        });

        const pipeline = new pipelines.CdkPipeline(this, 'Pipeline', {
            cloudAssemblyArtifact,
            sourceAction,
            synthAction
        });

        // Pre-prod
        //
        const preProdApp = new springBootApiStage(this, 'Pre-Prod');
        const preProdStage = pipeline.addApplicationStage(preProdApp);
        const serviceUrl = pipeline.stackOutput(preProdApp.urlOutput);

        preProdStage.addActions(new pipelines.ShellScriptAction({
            actionName: 'IntegrationTests',
            runOrder: preProdStage.nextSequentialRunOrder(),
            additionalArtifacts: [
                sourceArtifact
            ],
            commands: [
                'npm install',
                'npm run build'
            ],
            useOutputs: {
                SERVICE_URL: serviceUrl
            }
        }));

        // Prod
        //
        // const prodApp = new springBootApiStage(this, 'Prod');
        // const prodStage = pipeline.addApplicationStage(prodApp);
    }
}
