import { PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export class BaseEntity {
  /**
   * @public
   * @readonly
   * @type {string}
   */
  @ApiProperty()
  @PrimaryKey({ type: 'uuid' })
  public readonly id: string = uuidv4();

  /**
   * @public
   * @readonly
   * @type {?Date}
   */
  @ApiProperty()
  @Property({
    fieldName: 'created_at',
    type: 'timestamp without time zone',
  })
  public readonly created_at?: Date;

  /**
   * @public
   * @readonly
   * @type {?Date}
   */
  @ApiProperty()
  @Property({
    fieldName: 'last_updated_at',
    nullable: true,
    type: 'timestamp without time zone',
  })
  public last_updated_at?: Date;

  constructor(id: string, created_at: Date, last_updated_at: Date) {
    this.id = id;
    this.created_at = created_at;
    this.last_updated_at = last_updated_at;
  }
}
