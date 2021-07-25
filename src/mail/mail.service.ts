import got from 'got';
import FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions, EmailVar } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    to = 'stanmusic775@gmail.com',
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append(
      'from',
      `Stan from Clone Eats <mailgun@${this.options.domain}>`,
    );
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((emailVar) =>
      form.append(`v:${emailVar.key}`, emailVar.value),
    );
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
    } catch (e) {
      console.log(e);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail(
      'Verify Your Account',
      'stanmusic775@gmail.com',
      'confirm_account',
      [
        { key: 'code', value: code },
        { key: 'username', value: email },
      ],
    );
  }
}
