const express = require("express");
const axios = require("axios");
const serverPort = 3500;

const app = express();

// Top level middlewares
// app.use(express.json());

// Requests
app.get("/people", async (req, res) => {
  const { sortBy } = req.query;
  const allCharacters = [];
  let swaPeeps = "https://swapi.co/api/people";
  do {
    try {
      const { data } = await axios.get(swaPeeps);
      data.results.forEach(person => {
        allCharacters.push(person);
      });
      swaPeeps = data.next;
    } catch (error) {
      console.log(error);
    }
  } while (swaPeeps);

  if (sortBy) {
    console.log("sorting");
    const sortedCharacters = allCharacters.sort((a, b) => {
      const first = a[sortBy].toUpperCase();
      const second = b[sortBy].toUpperCase();
      if (first < second) {
        return -1;
      }
      if (first > second) {
        return 1;
      }
      return 0;
    });
    res.status(200).send(sortedCharacters);
  } else {
    res.status(200).send(allCharacters);
  }
});

app.get("/planets", (req, res) => {
  res.status(200).send("planets");
});

// I would normally store the port number in a .env file however I have omitted this step for simplicity
app.listen(serverPort, () =>
  console.log(`Server is running on port ${serverPort}`)
);
