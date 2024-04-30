import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentPayload } from './payloads/document.payload';
import { ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { FindOneParams } from './payloads/find-one.payload';

@Controller('document')
export class DocumentController {
  public constructor(private readonly documentService: DocumentService) {}

  @Post('/')
  @ApiBody({ type: DocumentPayload })
  public async create(@Body() payload: DocumentPayload): Promise<any> {
    return this.documentService.create(payload);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiOperation({ summary: 'Get Document by Id.' })
  public async get(@Param() params: FindOneParams): Promise<any>
  {
    return this.documentService.get(params.id);
  }
}
