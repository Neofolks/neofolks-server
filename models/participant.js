const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  teamName: {
    type: String,
  },
});

module.exports = mongoose.model("Participant", participantSchema);
