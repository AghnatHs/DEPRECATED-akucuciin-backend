const nodemailer = require("nodemailer");
const { ServerError } = require("../errors/customError");

const sender = '"AkuCuciin NoReply" <mailer@akucuciin.my.id>';

const transporter = nodemailer.createTransport({
  name: "mail.akucuciin.my.id",
  host: "mail.akucuciin.my.id",
  port: 465,
  secure: true,
  requireTLS: false,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

const MailerService = {
  sendVerifyEmail: async (email, registerToken) => {
    var mailOptions;
    mailOptions = {
      from: sender,
      to: email,
      subject: "Aktivasi akun AkuCuciin",
      html: `<html><body>Please activate your AkuCuciin account. If you feel you are not registered, please ignore this message. Press <a href="${
        process.env.VERIFY_URI
      }${email}/${registerToken}">Verify Email</a> to verify, only valid for ${
        Number(process.env.VERIFY_MAX_AGE) / 60
      } minutes.</body></html>`,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });
  },
  sendRequestResetPassword: async (email, resetPasswordToken) => {
    var mailOptions;
    mailOptions = {
      from: sender,
      to: email,
      subject: "Permintaan reset password akun AkuCuciin",
      html: `<html><body>We received a request to reset your password for your Akucuciin account. If you didnt request a password reset, you can safely ignore this email. To reset your password, click the link below: <a href="${
        process.env.RESET_PASSWORD_FORM_URI
      }${email}/${resetPasswordToken}">Reset Password</a>. For security purposes, this link will expire in ${
        Number(process.env.RESET_PASSWORD_MAX_AGE) / 60
      } minutes</body></html>`,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });
  },
};

module.exports = MailerService;
