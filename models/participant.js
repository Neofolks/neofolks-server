const mongoose = require('mongoose')

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // registrationDate: {
    //     type: Date,
    //     required: true,
    //     default: Date.now
    // }
})

module.exports = mongoose.model('Participant', participantSchema)