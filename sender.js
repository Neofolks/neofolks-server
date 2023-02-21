require("dotenv").config();
const nodemailer = require("nodemailer");
// const nodemailer = require("nodejs-nodemailer-outlook");

// async function sender(email, name) {
//   return nodemailer.sendEmail({
//     auth: {
//       user: process.env.USER,
//       pass: process.env.PASS,
//     },
//     from: process.env.USER,
//     to: email,
//     subject: `Hey ${name}, you are awesome!`,
//     html: "<b>Theres nothing in here</b>",
//     text: "some dummy text content",
//     replyTo: process.env.USER,

//     onError: (e) => console.log(e),
//     onSuccess: (i) => {
//       console.log(`Mail sent to ${email}`);
//     },
//   });
// }

// Trying nodemailer instead of nodemailer-outlook
// To prevent throttling for concurrent connections
// https://learn.microsoft.com/en-us/exchange/troubleshoot/send-emails/smtp-submission-improvements
const sender = async (email, bccEmails, teamName) => {
  const transporter = nodemailer.createTransport({
    service: "Outlook365",
    host: "smtp.office365.com",
    secureConnection: false,
    port: 587,
    pool: true,
    maxConnections: 3,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const options = {
    from: process.env.USER,
    to: email,
    bcc: bccEmails,
    subject: `Hey ${teamName}, you are awesome!`,
    html: "<b>Theres nothing in here</b>",
    text: "some dummy text content",
    replyTo: process.env.USER,
  };

  transporter.sendMail(options, (error, info) => {
    if (error) console.log(error);
    else console.log("Mail sent to ", info.accepted);
    transporter.close();
  });
};

module.exports = sender;
