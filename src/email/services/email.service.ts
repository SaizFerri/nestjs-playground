import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../config/services/config.service';

import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  mailTransport: any;

  constructor(private readonly config: ConfigService) {
    this.mailTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: config.get('EMAIL_USER'),
          pass: config.get('EMAIL_PASS')
        }
    });
  }

  sendMail(from: string, to: string, subject: string, html: string, text: string = '') {
    this.mailTransport.sendMail({
      from,
      to,
      subject,
      text,
      html
    });
  }
}