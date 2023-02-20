require('dotenv').config()
const express = require('express')
// const authenticate = require('./auth')
const cors = require('cors')
const mongoose = require('mongoose')
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

// Middleware for auth
// app.use(authenticate)

// Middleware to work with json in req/res body
app.use(express.json())

// Create /participants route
const participantsRouter = require('./routes/participants')
app.use('/participants', participantsRouter)

app.get('/', (req, res) =>{
    res.send("Server online 🤙")
})

app.listen(process.env.PORT || 3000, async () =>{
    console.log('Server running');
})