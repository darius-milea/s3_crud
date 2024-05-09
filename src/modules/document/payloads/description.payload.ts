import { IsOptional, IsString } from 'class-validator';

export class DescriptionPayload {
  @IsOptional()
  @IsString()
  description: string;
}
