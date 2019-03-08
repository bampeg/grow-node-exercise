const express = require('express')
const serverPort = 3500

const app = express()

// Top level middlewares
app.use(express.json())

// Requests
app.get('/people', (req, res) => {
   res.status(200).send('people')
})

app.get('/planets', (req, res) => {
   res.status(200).send('planets')
})

// I would normally store the port number in a .env file however I have omitted this step for simplicity
app.listen(serverPort, () => console.log(`Server is running on port ${serverPort}`))