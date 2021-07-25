import { CONFIG_OPTIONS } from './../common/common.constants';
import { MailService } from './mail.service';
import { MailModuleOptions } from './mail.interfaces';
import { DynamicModule, Global, Module } from '@nestjs/common';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }, MailService],

      exports: [MailService],
    };
  }
}
