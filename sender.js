require("dotenv").config();
const nodemailer = require("nodejs-nodemailer-outlook");

async function sender(email) {
  return nodemailer.sendEmail({
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    from: process.env.USER,
    to: email,
    subject: "nodemailer test mail",
    html: "<b>This is bold text</b>",
    text: "This is text version!",

    onError: (e) => console.log(e),
    onSuccess: (i) => {
      console.log(`Mail sent to ${email}`);
    },
  });
}

module.exports = sender
