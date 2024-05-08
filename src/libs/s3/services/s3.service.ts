import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { S3ModuleOptions } from '../types';

@Injectable()
export class S3Service {
  private readonly logger = new Logger('s3');
  private s3_client;

  constructor(
    @Inject('S3_OPTIONS') private readonly s3Config: S3ModuleOptions,
  ) {
    this.s3_client = new S3Client({
      endpoint: s3Config.aws_connection.endpoint,
      region: s3Config.aws_connection.region,
      credentials: s3Config.aws_connection.credentials,
    });
  }

  public async listBuckets(): Promise<string> {
    const command = new ListBucketsCommand({});

    try {
      const { Owner, Buckets } = await this.s3_client.send(command);
      this.logger.debug(`${Buckets.map((b) => ` • ${b.Name}`).join('\n')}`);
      return `${Owner.DisplayName} owns ${Buckets.length} bucket${Buckets.length === 1 ? '' : 's'}`;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
