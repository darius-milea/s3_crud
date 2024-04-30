import { Injectable } from '@nestjs/common';
import { DocumentPayload } from './payloads/document.payload';
import { v4 as uuid } from 'uuid';
import { DocumentEntity } from 'src/entities/document.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { UUID } from 'crypto';

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

  constructor(
    protected readonly documentEntityManager: EntityManager,
  ) {}

  /**
   * @public
   * @async
   * @param {DocumentPayload} request
   * @returns {Promise<string>}
   */
  public async create(payload: DocumentPayload): Promise<string> {
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

    const document_json = JSON.stringify(document)

    this.logger.debug(`Document created ${document_json}`)

    return document_json;
  }

  /**
   * @public
   * @async
   * @param {string} id
   * @returns {Promise<string>}
   */
  public async get(id: string): Promise<string> {
    const document = await this.documentEntityManager.findOneOrFail(DocumentEntity, {id: id});

    const document_json = JSON.stringify(document)

    this.logger.debug(`Document found ${document_json}`)

    return document_json;
  }
}
