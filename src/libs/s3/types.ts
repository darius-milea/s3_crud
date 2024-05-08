export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export interface AwsConnectionOptions {
  aws_role_arn: string;
  aws_local_connection: boolean;
  region: string;
  endpoint: string | undefined;
  forcePathStyle: boolean | undefined;
  credentials: AwsCredentials;
}

export interface S3ModuleOptions {
  bucket: string;
  aws_connection: AwsConnectionOptions;
}
