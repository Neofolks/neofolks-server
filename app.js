require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const nodemailer = require('nodejs-nodemailer-outlook')

// Initializing app
const app = express()
app.use(cors())

// Connecting to mongoDB
mongoose.connect(process.env.DATABASE_URL, (err) => {
    err? console.log(err) : console.log("Remote URL OK");
})

// Coonecting to DB
const database = mongoose.connection
database.on('error', (err) => console.log(err))
database.on('open', () => console.log("Database connected"))


app.use(express.json())
const participantsRouter = require('./routes/participants')
app.use('/participants', participantsRouter)

app.get('/', (req, res) =>{
    res.send("Server online 🤙")
})

app.listen(3000, async () =>{
    console.log('Server running');
})