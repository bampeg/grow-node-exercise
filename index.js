const express = require("express");
const axios = require("axios");
const serverPort = 3500;

const app = express();

// Top level middlewares
// app.use(express.json());

// Requests
app.get("/people", async (req, res) => {
  const { sortBy } = req.query;
  const allPeople = [];
  let swaPeeps = "https://swapi.co/api/people";
  do {
    try {
      const { data } = await axios.get(swaPeeps);
      data.results.forEach(person => {
        allPeople.push(person);
      });
      swaPeeps = data.next;
    } catch (error) {
      console.log(error);
    }
  } while (swaPeeps);

  res.status(200).send(allPeople);
});

app.get("/planets", (req, res) => {
  res.status(200).send("planets");
});

// I would normally store the port number in a .env file however I have omitted this step for simplicity
app.listen(serverPort, () =>
  console.log(`Server is running on port ${serverPort}`)
);
