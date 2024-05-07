import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import {
  CreateDocumentPayload,
  UpdateDocumentPayload,
} from './payloads/document.payload';
import { ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';
import { FindOneParams } from './payloads/find-one.payload';

@Controller('document')
export class DocumentController {
  public constructor(private readonly documentService: DocumentService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create Document' })
  @ApiBody({ type: CreateDocumentPayload })
  public async create(@Body() payload: CreateDocumentPayload): Promise<any> {
    return this.documentService.create(payload);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiOperation({ summary: 'Get Document by Id.' })
  public async get(@Param() params: FindOneParams): Promise<any> {
    return this.documentService.get(params.id);
  }

  @Patch('/')
  @ApiOperation({ summary: 'Update Document' })
  @ApiBody({ type: UpdateDocumentPayload })
  public async update(@Body() payload: UpdateDocumentPayload): Promise<any> {
    return this.documentService.update(payload);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiOperation({ summary: 'Delete Document by id' })
  @ApiBody({ type: UpdateDocumentPayload })
  public async delete(@Param() params: FindOneParams): Promise<any> {
    return this.documentService.delete(params.id);
  }
}
