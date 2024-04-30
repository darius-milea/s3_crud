import { Logger } from '@nestjs/common';
import { Options, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import migrationConfig from "./mikro-orm-migration.config";
import { MigrationGenerator } from './libs/orm/migratior';

dotenv.config({ path: resolve('.env') });

const logger = new Logger('MikroORM');
const config: Options = defineConfig({
  discovery: {
    warnWhenNoEntities: true, //enable when entities available
  },
  allowGlobalContext: false, // would produce memory leaks, only used for testing purposes
  dbName: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  entities: [`${__dirname}/entities/*.{ts,js}`],
  namingStrategy: UnderscoreNamingStrategy,
  logger: logger.log.bind(logger),
  extensions: migrationConfig.extensions,
  migrations: {
    path: migrationConfig.migrations.path,
    pathTs: `${process.cwd()}/migrations`,
    glob: "!(*.d).{js,ts}",
    snapshot: true,
    generator: MigrationGenerator,
    transactional: migrationConfig.migrations.transactional,
    dropTables: migrationConfig.migrations.dropTables,
    safe: migrationConfig.migrations.safe,
    disableForeignKeys: migrationConfig.migrations.disableForeignKeys,
  },
});

export default config;
