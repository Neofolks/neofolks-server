require("dotenv").config();
const nodemailer = require("nodejs-nodemailer-outlook");

async function sender(email, name) {
  return nodemailer.sendEmail({
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    from: process.env.USER,
    to: email,
    subject: `Hey ${name}, you are awesome!`,
    html: "<b>Theres nothing in here</b>",
    text: "some dummy text content",
    replyTo: process.env.USER,

    onError: (e) => console.log(e),
    onSuccess: (i) => {
      console.log(`Mail sent to ${email}`);
    },
  });
}

module.exports = sender
