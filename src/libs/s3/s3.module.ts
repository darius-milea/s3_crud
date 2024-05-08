import { DynamicModule, Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { ConfigModule } from '@nestjs/config';
import { S3_CONFIG } from './s3.config';
import { S3ModuleOptions } from './types';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [S3_CONFIG],
    }),
  ],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {
  static register(
    token: symbol | string,
    options: S3ModuleOptions,
  ): DynamicModule {
    return {
      module: S3Module,
      providers: [
        {
          provide: 'S3_OPTIONS',
          useValue: options,
        },
        {
          provide: token,
          useClass: S3Service,
        },
      ],
      exports: [
        token,
        {
          provide: 'S3_OPTIONS',
          useValue: options,
        },
      ],
    };
  }
}
