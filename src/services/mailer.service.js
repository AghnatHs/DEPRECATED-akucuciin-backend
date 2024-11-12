const nodemailer = require("nodemailer");
const { ServerError } = require("../errors/customError");

const MailerService = {
  sendVerifyEmail: (email, registerToken) => {
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

    var mailOptions;
    let sender = "akucuciindev";
    mailOptions = {
      from: sender,
      to: email,
      subject: "Aktivasi akun AkuCuciin",
      html: `Press <a href="${process.env.VERIFY_URI}${registerToken}">Verify Email</a> to verify, valid for 5 minutes. If you feel you are not registered, please ignore this message.`,
    };

    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        throw new ServerError("Internal Server Error")
      } else {
        console.log("message sent");
      }
    });
  },
};

module.exports = MailerService;
