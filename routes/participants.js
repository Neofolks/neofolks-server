// require("dotenv").config();
const express = require("express");
const router = express.Router();
// const nodemailer = require("nodejs-nodemailer-outlook");
const sender = require('../sender')
const participantModel = require("../models/participant");

// Getting all
router.get("/", async (req, res) => {
  try {
    const allParticipants = await participantModel.find();
    res.json(allParticipants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting one
router.get("/:email", getParticipant, (req, res) => {
  res.json(res.participant);
});

// Creating one
router.post("/", async (req, res) => {
  const participant = new participantModel({
    name: req.body.name,
    email: req.body.email,
  });

  try {
    // Saving new participant to DB
    const newParticipant = await participant.save();
    console.log("New entry saved: ", participant.name);

    // Sending email confirmation on rsvp
    // nodemailer.sendEmail({
    //   auth: {
    //     user: process.env.USER,
    //     pass: process.env.PASS,
    //   },
    //   from: process.env.USER,
    //   to: req.body.email,
    //   subject: "nodemailer test mail",
    //   html: "<b>This is bold text</b>",
    //   text: "This is text version!",

    //   onError: (e) => console.log(e),
    //   onSuccess: (i) => {
    //     console.log(`Mail sent to ${req.body.email}`);
    //     res.status(201).json(newParticipant);
    //   },
    // });
    await sender(req.body.email)
    res.status(201).json(newParticipant)

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleting one
router.delete("/:email", getParticipant, async (req, res) => {
  try {
    await res.participant.remove();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getParticipant(req, res, next) {
  let participant;
  try {
    participant = await participantModel
      .findOne()
      .where({ email: req.params.email });
    if (participant == null) {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.participant = participant;
  next();
}

module.exports = router;
