import { Inject, Injectable, Logger } from "@nestjs/common";
import { DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { S3ModuleOptions } from "../types";
import { Readable } from "stream";

@Injectable()
export class S3Service {
  private readonly logger = new Logger('s3');
  private s3_client: S3Client;

  constructor(
    @Inject('S3_OPTIONS') private readonly s3Config: S3ModuleOptions,
  ) {
    this.s3_client = new S3Client({
      endpoint: this.s3Config.aws_connection.endpoint,
      region: this.s3Config.aws_connection.region,
      credentials: this.s3Config.aws_connection.credentials,
      forcePathStyle: this.s3Config.aws_connection.forcePathStyle,
    });
  }

  /**
   * Uploads file to S3 Bucket
   *
   * @async
   * @method uploadFile
   * @param {string} fileKey - The filename which we'll use to later identify the file.
   * @param {ReadableStream} stream - the stream of the file
   * @returns {Promise<string>} - A promise that resolves and returns the URL of the file stored on S3 Bucket.
   */
  uploadFile(fileKey: string, stream: Readable): Upload {
    return new Upload({
      client: this.s3_client,
      params: {
        Bucket: this.s3Config.bucket,
        Key: fileKey,
        Body: stream,
      },
    });
  }

  /**
   * @async
   * @method getFile
   * @param {string} fileKey - key used to identify the file we're going to download
   * @param {string} filename - filename used to rename the file from s3
   * @returns {Promise<Object>} - A promise that returns a file from the bucket
   */
  async getFile(fileKey: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.s3Config.bucket,
      Key: fileKey,
    });

    try {
      this.logger.debug({
        message: `Fetching file from S3 bucket`,
        fileKey,
        bucket: this.s3Config.bucket,
      });

      const response = await this.s3_client.send(command);

      if (!response.Body) {
        throw new Error('File body is empty');
      }

      this.logger.debug(`Transforming response to byte array ${fileKey}`);

      const buffer = Buffer.from(await response.Body.transformToByteArray());

      return buffer;
    } catch (err) {
      this.logger.error({
        message: err?.message || 'Error while getting file from s3',
        stack: err?.stack,
        fileKey,
      });

      throw err;
    }
  }

  /**
   * Deletes file from S3 Bucket
   *
   * @async
   * @method deleteFile
   * @param {string} fileKey - The filename which we'll use to identify and delete the file from the bucket.
   * @returns {Promise<void>} - A promise that resolves when we've deleted the file.
   */
  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.s3Config.bucket,
      Key: fileKey,
    });

    try {
      this.logger.debug(`Deleting s3 file with key ${fileKey}`);

      await this.s3_client.send(command);
    } catch (err) {
      this.logger.error({
        message: err?.message || 'Error while deleting file from s3',
        stack: err?.stack,
        fileKey,
      });

      throw err;
    }
  }
}
