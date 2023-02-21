const express = require("express");
const router = express.Router();
const sender = require("../sender");
const authenticate = require("../auth");
const participantModel = require("../models/participant");

// Getting all
router.get("/", authenticate, async (req, res) => {
  try {
    const allParticipants = await participantModel.find();
    res.json(allParticipants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting one
router.get("/:email", authenticate, getParticipant, (req, res) => {
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
    await sender(req.body.email, req.body.name);
    res.status(201).json(newParticipant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleting one
router.delete("/:email", authenticate, getParticipant, async (req, res) => {
  try {
    await res.participant.remove();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deleting all
router.delete("/", authenticate, async (req, res) => {
  try {
    await participantModel.deleteMany();
    res.json({ message: "Deleted all participants" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// middleware to find participant using email
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
