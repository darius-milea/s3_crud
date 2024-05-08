import { registerAs } from '@nestjs/config';
import { S3ModuleOptions, AwsConnectionOptions } from './types';

export const awsConnectionConfig: AwsConnectionOptions = {
  aws_local_connection: process.env.AWS_LOCAL_CONNECTION === 'true',
  aws_role_arn: process.env.AWS_ROLE_ARN,
  region: process.env.AWS_REGION || 'none',
  endpoint:
    process.env.AWS_LOCAL_CONNECTION === 'true'
      ? process.env.AWS_LOCAL_ENDPOINT
      : undefined,
  forcePathStyle:
    process.env.AWS_LOCAL_CONNECTION === 'true' ? true : undefined,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
};

export const s3Config: S3ModuleOptions = {
  bucket: process.env.AWS_S3_BUCKET || 'none',
  aws_connection: awsConnectionConfig,
};

export const S3_CONFIG = registerAs('s3', () => s3Config);
