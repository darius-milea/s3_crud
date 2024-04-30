import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DocumentEntity } from 'src/entities/document.entity';

@Module({
  imports: [MikroOrmModule.forFeature([DocumentEntity])],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
