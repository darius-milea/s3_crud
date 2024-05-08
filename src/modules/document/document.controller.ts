import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  Header,
  Response,
  StreamableFile,
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
  public async get(@Param() params: FindOneParams, @Response({ passthrough: true }) response: Res): Promise<any> {
    const {buffer, fileName, mimetype} = await this.documentService.get(params.id);

    var fileExt = fileName.split('.').pop();

    response.set({
      "Content-Type": mimetype,
      "Content-Disposition": `attachment; filename="${fileName}"`,
   });

    return new StreamableFile(buffer)    
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() description: DescriptionPayload) {
    return this.documentService.upload(file, description);
  }
}
