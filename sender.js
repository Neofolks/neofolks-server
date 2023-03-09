require("dotenv").config();
const nodemailer = require("nodemailer");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const fs = require("fs");
const generateQR = require("./generateQR");

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

// Send email using mailgun
const DOMAIN = "updates.neofolks.live";
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url: "https://api.eu.mailgun.net",
});

const mailgunSender = async (email, name, id) => {
  // const messageData = {
  //   from: "Ohm Patil <ohm@neofolks.live>",
  //   to: email,
  //   // bcc: bccEmails ?? [],
  //   subject: `Hey ${name}, your RSVP is confirmed!`,
  //   text: "Testing some Mailgun awesomeness!",
  // };

  try {
    const timerId = setInterval(() => {
      const fileExists = fs.existsSync(`./${id}.png`);
      if (fileExists) {
        // Reading file
        fs.promises.readFile(`./${id}.png`).then(async (data) => {
          const file = {
            filename: `${name}'s QR.png`,
            data,
          };
          // Creating email params
          const messageData = {
            from: "Neofolks <updates@neofolks.live>",
            to: email,
            subject: `Hey ${name}, your RSVP is confirmed!`,
            text: "Thank you for registering! We look forward to seeing you soon. It couldn't have been done without you! We are organizing a 5-day technical event in accordance with NUVYUVA which will consist of various executive talks, workshops, and hackathon at the Navrachana University. A follow-up will soon be provided with a detailed event timeline! Super excited to have you on board with us! Ps: Kindly save the QR for future reference. Regards, Team Neofolks 2023",
            attachment: file,
          };
          // Sending email
          const response = await client.messages.create(DOMAIN, messageData);
          console.log(await response.message);
          // Deleting file after sending
          fs.unlinkSync(`./${id}.png`);
        });
        clearInterval(timerId);
      } else {
        console.log("File not found");
        return;
      }
    }, 1000);
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = { mailgunSender, sender };
