import l from '../../common/logger';

const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
class EmailService {
  send(recipients, subject, text) {
    // create reusable transporter object using the default SMTP transport
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS,
      },
    });

      // setup email data with unicode symbols
    const mailOptions = { from: '"Russell" <Russell@deephire.com', to: recipients, subject, text }; // sender address // list of receivers // Subject line // plain text body // html body

    // send mail with defined transport object
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

