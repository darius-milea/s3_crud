import { IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateDocumentPayload {
  @IsOptional()
  @IsString()
  file_name: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateDocumentPayload extends CreateDocumentPayload {
  @IsUUID('4')
  @IsNotEmpty()
  id: string;
}
