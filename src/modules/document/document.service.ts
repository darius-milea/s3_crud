import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DocumentEntity } from 'src/entities/document.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { S3Service } from 'src/libs/s3/services/s3.service';
import { DescriptionPayload } from './payloads/description.payload';
import { FileResponseObject } from './types';

/**
 * @export
 * @class DocumentService
 * @typedef {DocumentService}
 */
@Injectable()
export class DocumentService {
  /**
   *
   * @constructor
   * @param {EntityManager} documentEntityManager
   */

  private readonly logger = new Logger('DocumentService');
  @Inject('S3_DOCUMENT_TOKEN')
  private readonly s3Service: S3Service;

  constructor(private readonly documentEntityManager: EntityManager) {}

  /**
   * @public
   * @async
   * @param {string} id
   * @returns {Promise<string>}
   */
  public async get(id: string): Promise<FileResponseObject> {
    const document_metadata = await this.documentEntityManager.findOneOrFail(
      DocumentEntity,
      { id: id },
    );

    const document_json = JSON.stringify(document_metadata);

    const s3_document_buffer = await this.s3Service.getFile(id)

    this.logger.debug(`Document found ${document_json}`);

    return {
      buffer: s3_document_buffer,
      fileName: document_metadata.file_name,
      mimetype: document_metadata.mimetype
    }
  }

  // /**
  //  * @public
  //  * @async
  //  * @param {UpdateDocumentPayload} payload
  //  * @returns {Promise<string>}
  //  */
  // public async update(payload: UpdateDocumentPayload): Promise<string> {
  //   const document = await this.documentEntityManager.findOneOrFail(
  //     DocumentEntity,
  //     { id: payload.id },
  //   );

  //   const currentDateTime = new Date();

  //   Object.keys(payload).forEach((key) => {
  //     if (document.hasOwnProperty(key)) {
  //       document[key] = payload[key];
  //     }
  //   });

  //   document.last_updated_at = currentDateTime;

  //   await this.documentEntityManager.persistAndFlush(document);

  //   const document_json = JSON.stringify(document);

  //   this.logger.debug(`Document updated ${document_json}`);

  //   return document_json;
  // }

  /**
   * @public
   * @async
   * @param {string} id
   * @returns {Promise<string>}
   */
  public async delete(id: string): Promise<string> {
    const document = await this.documentEntityManager.findOneOrFail(
      DocumentEntity,
      { id: id },
    );

    await this.documentEntityManager.remove(document).flush();

    const returnMessage = `Document with id: ${id} deleted`;

    this.logger.debug(returnMessage);

    return returnMessage;
  }

  /**
   * @public
   * @async
   * @param {string} id
   * @returns {Promise<string>}
   */
  public async upload(file: Express.Multer.File, description: DescriptionPayload): Promise<string> {
    const id = uuid();
    const currentDateTime = new Date();

    const document = new DocumentEntity(
      id,
      currentDateTime,
      currentDateTime,
      file.originalname,
      description.description,
      file.mimetype,
      file.size,
    );

    await this.documentEntityManager.persistAndFlush(document);

    await this.s3Service.uploadFile(id, file.buffer)

    const document_json = JSON.stringify(document);

    this.logger.debug(`Document uploaded ${document_json}`);

    return document_json;
  }

}
