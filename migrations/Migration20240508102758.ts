// this file was auto-generated via migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20240508102758 extends Migration {

  async up(): Promise<void> {
    this.addSql(`alter table if exists "document" add column if not exists "size" int null;`);
  }

}
