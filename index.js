const express = require('express')
const serverPort = 3500

const app = express()

app.use(express.json())

// I would normally store the port number in a .env file however I have omitted this step for simplicity
app.listen(serverPort, () => console.log(`Server is running on port ${serverPort}`))