// this file was auto-generated via migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20240430130844 extends Migration {

  async up(): Promise<void> {
    this.addSql(`create table if not exists "document" ("id" uuid not null, "created_at" timestamptz not null, "last_updated_at" timestamptz null, "file_name" text null, "description" text null, constraint "document_pkey" primary key ("id"));`);
  }

}
