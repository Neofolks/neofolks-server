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
    subject: "This is a test confirmation email",
    html: "<b>If you received this, then GG</b>",
    text: "some dummy text content",

    onError: (e) => console.log(e),
    onSuccess: (i) => {
      console.log(`Mail sent to ${email}`);
    },
  });
}

module.exports = sender
