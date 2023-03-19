require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const teamModel = require("./models/team");
const participantModel = require("./models/participant");
mongoose.set('strictQuery', false)

// Initializing app
const app = express()
app.use(cors())

// Connecting to mongoDB
mongoose.connect(process.env.DATABASE_URL, (err) => {
    err? console.log(err) : console.log("Remote URL OK");
})

// Connecting to DB
const database = mongoose.connection
database.on('error', (err) => console.log(err))
database.on('open', () => console.log("Database connected"))


// Middleware to work with json in req/res body
app.use(express.json())

// Create /participants route
const participantsRouter = require('./routes/participants')
app.use('/participants', participantsRouter)

// Create /teams route
const teamsRouter = require('./routes/teams')
app.use('/teams', teamsRouter)

// Create /regs route
app.get('/regs', async (req, res) => {
    const participantCount = await participantModel.countDocuments()
    const teamCount = await teamModel.countDocuments()
    res.json({"teamCount": teamCount, "participantCount": participantCount})
}) 

app.get('/', (req, res) =>{
    res.send("Server online 🤙")
})

app.listen(process.env.PORT || 3000, async () =>{
    console.log('Server running');
})