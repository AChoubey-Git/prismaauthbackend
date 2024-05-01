import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class MailService {
  constructor(
    private _prismaService: PrismaService,
    private _configService: ConfigService,
  ) {}
  async mailSender(email, title, body) {
    try {
      const { host, pass, user, from } = this._configService.get('mail');
      let smtpConfig = {};
      if (user && pass) {
        smtpConfig = {
          host,
          auth: {
            user,
            pass,
          },
        };
      } else {
        const account = await nodemailer.createTestAccount();
        smtpConfig = {
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        };
      }
      // Create a Transporter to send emails
      let transporter = nodemailer.createTransport(smtpConfig);
      // Send emails to users
      let info = await transporter.sendMail({
        from,
        to: email,
        subject: title,
        html: body,
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      return { preview_email: previewUrl };
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async sendVerificationEmail(email) {
    try {
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const mailResponse = await this.mailSender(
        email,
        'Verification Email',
        `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`,
      );
      await this.createUserOtp({ email, otp });
      return { otp, ...mailResponse };
    } catch (error) {
      console.log('Error occurred while sending email: ', error);
      throw error;
    }
  }

  async verifyOtp(data: { email: string; otp: string }) {
    const userOtp = await this._prismaService.userotp.findMany({
      where: data,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      take: 1,
    });
    return userOtp[0].otp === data.otp;
  }
  async createUserOtp(data: { email: string; otp: string }) {
    return this._prismaService.userotp.create({ data });
  }

  async update(data: { isVerified: boolean; email: string; otp: string }) {
    const { isVerified, email, otp } = data;
    return this._prismaService.userotp.update({
      where: { email, otp },
      data,
      select: {
        email: true,
        isVerified: true,
        otp: true,
      },
    });
  }

  async findOne(query: { email: string }) {
    return this._prismaService.userotp.findUnique({ where: query });
  }
}
