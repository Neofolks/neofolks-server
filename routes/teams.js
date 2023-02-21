const express = require("express");
const router = express.Router();
const sender = require("../sender");
const authenticate = require("../auth");
const teamModel = require("../models/team");
const participantModel = require("../models/participant");

// Getting all teams
router.get("/", authenticate, async (req, res) => {
  try {
    const allTeams = await teamModel.find();
    res.json(allTeams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting one team
router.get("/:team_name", authenticate, getTeam, (req, res) => {
  res.json(res.team);
});

// Creating one team
router.post("/", async (req, res) => {
  const team = new teamModel({
    name: req.body.name,
    memberCount: req.body.memberCount,
    members: req.body.members,
  });

  try {
    // Saving new team to DB
    const newTeam = await team.save();
    saveParticipants(newTeam.members, newTeam.name);

    console.log("New entry saved: ", team.name);

    // await sender(req.body.email, req.body.name);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deleting one
router.delete("/:team_name", authenticate, getTeam, async (req, res) => {
  try {
    await res.team.remove();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deleting all
router.delete("/", authenticate, async (req, res) => {
  try {
    await teamModel.deleteMany();
    res.json({ message: "Deleted all teams" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to find team using name
async function getTeam(req, res, next) {
  let team;
  try {
    team = await teamModel.findOne().where({ name: req.params.team_name });
    if (team == null) {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.team = team;
  next();
}

// Function to save team members as individual participants in DB and send email
async function saveParticipants(members, teamName) {
  // To store emails of all members
  let allEmails = [];
  members.forEach(async (member) => {
    try {
      let participant = new participantModel({
        name: member.name,
        email: member.email,
        teamName: teamName,
      });
      // Saving each member in 'participants' collection in DB
      let newParticipant = await participant.save();
      // Populating 'allEmails'
      allEmails.push(newParticipant.email);
      console.log("New participant added:", newParticipant.name);
    } catch (error) {
      console.log(error.message);
      return;
    }
  });
  // Popping first email from 'allEmails'
  let firstEmail = allEmails.shift();
  // Finally sending confirmation mail to 'firstEmail' and adding remaining 'allEmails' to BCC
  await sender(firstEmail, allEmails, teamName);
  return;
}

module.exports = router;
