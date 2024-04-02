import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import * as handlebars from 'handlebars';
import { commentReplyTemplate, commentTemplate } from 'src/templates/comment';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
  }

  async sendCommentCreateMail(
    to: string,
    subject: string,
    templateData: any,
  ): Promise<void> {
    const template = handlebars.compile(commentTemplate.content);
    const htmlToSend = template(templateData);

    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: to,
      subject: subject,
      html: htmlToSend,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendCommentReplyMail(
    to: string,
    subject: string,
    templateData: any,
  ): Promise<void> {
    const template = handlebars.compile(commentReplyTemplate.content);
    const htmlToSend = template(templateData);

    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: to,
      subject: subject,
      html: htmlToSend,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
