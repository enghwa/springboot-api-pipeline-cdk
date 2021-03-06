import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import rds = require('@aws-cdk/aws-rds');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');

export class springBootApiStack extends cdk.Stack {

  public readonly urlOutput: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Our VPC
    const vpc = new ec2.Vpc(this, "springboot-vpc", { maxAzs: 2 })
    //Our ECS Fargate Cluster in this VPC
    const springbootEcsCluster = new ecs.Cluster(this, "springbootCluster", {
      vpc,
      containerInsights: true
    })
    //Our Database
    const mySQLPassword = new secretsmanager.Secret(this, 'springbootDb', {
      generateSecretString: {
        excludePunctuation: true
      }
    });
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'dbsg', {
      vpc,
      description: "springboot app database security group"
    })
    dbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3306));
    const auroraServerlessRds = new rds.CfnDBCluster(this, "aurora-serverless", {
      engine: "aurora",
      engineMode: "serverless",
      engineVersion: "5.6",
      databaseName: 'notes_app',
      masterUsername: 'dbaadmin',
      masterUserPassword: mySQLPassword.secretValue.toString(),

      dbSubnetGroupName: new rds.CfnDBSubnetGroup(this, "db-subnet-group", {
        dbSubnetGroupDescription: `notes_app_db_cluster subnet group`,
        subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE }).subnetIds
      }).ref,
      vpcSecurityGroupIds: [dbSecurityGroup.securityGroupId],
      storageEncrypted: true,
      deletionProtection: false,
      backupRetentionPeriod: 14,
      scalingConfiguration: {
        autoPause: true,
        secondsUntilAutoPause: 900,
        minCapacity: 1,
        maxCapacity: 2
      }
    })
    //Our application in AWS Fargate + ALB
    const springbootApp = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'springboot app svc', {
      cluster: springbootEcsCluster,
      desiredCount: 3,
      cpu: 512,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('./springboot-app'),
        containerPort: 8080,
        environment: {
          'springdatasourceurl': `jdbc:mysql://` + auroraServerlessRds.attrEndpointAddress + `:3306/notes_app?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true`,
          'springdatasourceusername': 'dbaadmin'
        },
        secrets: {
          'mysqlpassword': ecs.Secret.fromSecretsManager(mySQLPassword)
        }
      }
    })
    //customize healthcheck on ALB
    springbootApp.targetGroup.configureHealthCheck({
      "port": 'traffic-port',
      "path": '/',
      "interval": cdk.Duration.seconds(5),
      "timeout": cdk.Duration.seconds(4),
      "healthyThresholdCount": 2,
      "unhealthyThresholdCount": 2,
      "healthyHttpCodes": "200,301,302"
    })
    this.urlOutput = new cdk.CfnOutput(this, 'Url', {
      value: springbootApp.loadBalancer.loadBalancerDnsName,
    });
    //autoscaling - cpu
    const springbootAutoScaling = springbootApp.service.autoScaleTaskCount({
      maxCapacity: 9,
      minCapacity: 3
    })
    springbootAutoScaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 45,
      policyName: "cpu autoscaling",
      scaleInCooldown: cdk.Duration.seconds(30),
      scaleOutCooldown: cdk.Duration.seconds(30)
    })
  }
}