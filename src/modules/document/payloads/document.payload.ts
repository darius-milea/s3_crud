import { IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class DocumentPayload {
  @IsOptional()
  @IsString()
  file_name: string;

  @IsOptional()
  @IsString()
  description: string;
}
