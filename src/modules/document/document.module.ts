import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DocumentEntity } from 'src/entities/document.entity';
import { S3Module } from 'src/libs/s3/s3.module';
import { s3Config } from 'src/libs/s3/s3.config';

@Module({
  imports: [
    MikroOrmModule.forFeature([DocumentEntity]),
    S3Module.register('S3_DOCUMENT_TOKEN', s3Config),
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
