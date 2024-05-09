import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Header,
  Response,
  StreamableFile,
  Put,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';
import { FindOneParams } from './payloads/find-one.payload';
import { FileInterceptor } from '@nestjs/platform-express';
import { DescriptionPayload } from './payloads/description.payload';
import { Response as Res } from 'express';

@Controller('document')
export class DocumentController {
  public constructor(private readonly documentService: DocumentService) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiOperation({ summary: 'Get Document by Id.' })
  @Header('Content-Disposition', 'attachment; filename="test.docx"')
  public async get(
    @Param() params: FindOneParams,
    @Response({ passthrough: true }) response: Res,
  ): Promise<any> {
    const { buffer, fileName, mimetype } = await this.documentService.get(
      params.id,
    );

    response.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return new StreamableFile(buffer);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiOperation({ summary: 'Delete Document by id' })
  @ApiBody({ type: FindOneParams })
  public async delete(@Param() params: FindOneParams): Promise<any> {
    return this.documentService.delete(params.id);
  }

  @Post('')
  @ApiOperation({ summary: 'Upload file to S3.' })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: DescriptionPayload,
  ) {
    return this.documentService.upload(file, body.description);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiOperation({ summary: 'Upload and replace file by id.' })
  @UseInterceptors(FileInterceptor('file'))
  updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: DescriptionPayload,
    @Param() params: FindOneParams,
  ) {
    return this.documentService.update(file, params.id, body.description);
  }
}
