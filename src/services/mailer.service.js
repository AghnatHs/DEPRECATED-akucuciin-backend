const nodemailer = require("nodemailer");
const { ServerError } = require("../errors/customError");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  service: "gmail",
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

const MailerService = {
  sendVerifyEmail: (email, registerToken) => {
    var mailOptions;
    let sender = "akucuciindev";
    mailOptions = {
      from: sender,
      to: email,
      subject: "Aktivasi akun AkuCuciin",
      html: `If you feel you are not registered, please ignore this message. Press <a href="${
        process.env.VERIFY_URI
      }${email}/${registerToken}">Verify Email</a> to verify, only valid for ${
        Number(process.env.VERIFY_MAX_AGE) / 60
      } minutes. `,
    };

    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        throw new ServerError("Internal Server Error");
      } else {
        console.log("message sent [verify register email]");
      }
    });
  },
  sendRequestResetPassword: (email, resetPasswordToken) => {
    var mailOptions;
    let sender = "akucuciindev";
    mailOptions = {
      from: sender,
      to: email,
      subject: "Permintaan reset password akun AkuCuciin",
      html: `We received a request to reset your password for your Akucuciin account. If you didnt request a password reset, you can safely ignore this email. To reset your password, click the link below: <a href="${
        process.env.RESET_PASSWORD_FORM_URI
      }${email}/${resetPasswordToken}">Reset Password</a>. For security purposes, this link will expire in ${
        Number(process.env.RESET_PASSWORD_MAX_AGE) / 60
      } minutes`,
    };

    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        throw new ServerError("Internal Server Error");
      } else {
        console.log("message sent [request reset password]");
      }
    });
  },
};

module.exports = MailerService;
