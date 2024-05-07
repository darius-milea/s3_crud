import { Injectable } from '@nestjs/common';
import {
  CreateDocumentPayload,
  UpdateDocumentPayload,
} from './payloads/document.payload';
import { v4 as uuid } from 'uuid';
import { DocumentEntity } from 'src/entities/document.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';

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

  constructor(protected readonly documentEntityManager: EntityManager) {}

  /**
   * @public
   * @async
   * @param {CreateDocumentPayload} request
   * @returns {Promise<string>}
   */
  public async create(payload: CreateDocumentPayload): Promise<string> {
    const id = uuid();
    const currentDateTime = new Date();

    const document = new DocumentEntity(
      id,
      currentDateTime,
      currentDateTime,
      payload.file_name,
      payload.description,
    );

    await this.documentEntityManager.persistAndFlush(document);

    const document_json = JSON.stringify(document);

    this.logger.debug(`Document created ${document_json}`);

    return document_json;
  }

  /**
   * @public
   * @async
   * @param {string} id
   * @returns {Promise<string>}
   */
  public async get(id: string): Promise<string> {
    const document = await this.documentEntityManager.findOneOrFail(
      DocumentEntity,
      { id: id },
    );

    const document_json = JSON.stringify(document);

    this.logger.debug(`Document found ${document_json}`);

    return document_json;
  }

  /**
   * @public
   * @async
   * @param {UpdateDocumentPayload} payload
   * @returns {Promise<string>}
   */
  public async update(payload: UpdateDocumentPayload): Promise<string> {
    const document = await this.documentEntityManager.findOneOrFail(
      DocumentEntity,
      { id: payload.id },
    );

    const currentDateTime = new Date();

    Object.keys(payload).forEach((key) => {
      if (document.hasOwnProperty(key)) {
        document[key] = payload[key];
      }
    });

    document.last_updated_at = currentDateTime;

    await this.documentEntityManager.persistAndFlush(document);

    const document_json = JSON.stringify(document);

    this.logger.debug(`Document updated ${document_json}`);

    return document_json;
  }

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
}
