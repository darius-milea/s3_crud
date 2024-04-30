import { Entity, Property, TextType } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'document' })
export class DocumentEntity extends BaseEntity {
  @ApiProperty()
  @Property({ type: TextType, nullable: true })
  file_name: string;

  @ApiProperty()
  @Property({ type: TextType, nullable: true })
  description: string;

  constructor(
    id: string,
    created_at: Date,
    last_updated_at: Date,
    file_name: string,
    description: string,
  ) {
    super(id, created_at, last_updated_at);
    this.file_name = file_name;
    this.description = description;
  }
}
