import l from '../../common/logger';
import getMessage from '../../common/emails';

const nodemailer = require('nodemailer');

class EmailService {
  send(recipients, type, data) {
    const { subject, text } = getMessage(type, data);
    const to = [...recipients];
    const bcc = ['r@deephire.com', 's@deephire.com'];

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Russell" <Russell@deephire.com>',
      to,
      bcc
      subject,
      text,
    };

    return new Promise(resolve => {
      transporter.sendMail(mailOptions, error => {
        if (error) {
          l.error(error);
          return resolve(500);
        }
        return resolve(200);
      });
    });
  }
}

export default new EmailService();
