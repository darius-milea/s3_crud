import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../../mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: () => ({ ...config }),
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
