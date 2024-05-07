import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

/**
 * NOTE: Used for dockerized mikro-orm-job that runs `migration:up`.
 * Configs are set up specifically to meet the requirements of running migrations only,
 * not intended for other uses. In development or any other purposes use the default mikro-orm config.
 */

const config = defineConfig({
  extensions: [Migrator],
  driver: PostgreSqlDriver,
  discovery: {
    warnWhenNoEntities: true,
  },
  migrations: {
    path: './dist/migrations',
    transactional: true,
    dropTables: false,
    safe: true,
    disableForeignKeys: false,
  },
});

export default config;
