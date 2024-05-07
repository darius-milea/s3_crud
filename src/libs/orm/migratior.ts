import { TSMigrationGenerator } from '@mikro-orm/migrations';

export class MigrationGenerator extends TSMigrationGenerator {
  generateMigrationFile(
    className: string,
    diff: { up: string[]; down: string[] },
  ): string {
    // Skip foreign keys for migration file
    diff.up = diff.up.filter(
      (str: string) => !str.toLowerCase().includes('_foreign'),
    );
    diff.down = diff.down.filter(
      (str: string) => !str.toLowerCase().includes('_foreign'),
    );

    const comment =
      '// this file was auto-generated via migration generator\n\n';
    return `${comment}${super.generateMigrationFile(className, diff)}`;
  }

  createStatement(sql: string, padLeft: number): string {
    if (sql) {
      // Adding idempotent statements
      sql = sql.replace('create table ', 'create table if not exists ');
      sql = sql.replace('create index ', 'create index if not exists ');
      sql = sql.replace('drop index ', 'drop index if exists ');
      sql = sql.replace('alter table ', 'alter table if exists ');
      sql = sql.replace('drop constraint ', 'drop constraint if exists ');
      sql = sql.replace('add column ', 'add column if not exists ');
      const padding = ' '.repeat(padLeft);
      const command = `this.addSql(\`${sql.replace(/['\\]/g, "\\'")}\`);`;
      return `${padding}${command}\n`;
    }

    return '\n';
  }
}
