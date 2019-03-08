const express = require("express");
const axios = require("axios");
const serverPort = 3500;

const app = express();

// Top level
app.use(async (req, res, next) => {
  req.characters = [];
  let swaPeeps = "https://swapi.co/api/people";
  do {
    try {
      const { data } = await axios.get(swaPeeps);
      data.results.forEach(person => {
        req.characters.push(person);
      });
      swaPeeps = data.next;
    } catch (error) {
      console.log(error);
    }
  } while (swaPeeps);
  next();
});

// Request level
app.get("/people", async (req, res) => {
  const { sortBy } = req.query;
  const allowableQueryParams = ["name", "height", "mass"];

  if (sortBy) {
    console.log("sorting");
    if (allowableQueryParams.includes(sortBy)) {
      const sortedCharacters = req.characters.sort((a, b) => {
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
      res
        .status(405)
        .send(
          "Please use 'name', 'height', or 'mass' for your sorting parameter."
        );
    }
  } else {
    res.status(200).send(characters);
  }
});

app.get("/planets", async (req, res) => {
  console.log(req.characters);
  const planets = [];
  let swaPlanets = "https://swapi.co/api/planets";
  do {
    try {
      const { data } = await axios.get(swaPlanets);
      data.results.forEach(planet => {
        planets.push(planet);
      });
      swaPlanets = data.next;
    } catch (err) {
      console.log(err);
    }
  } while (swaPlanets);
  const mappedPlanets = planets.map(planet => {
    const replacedResidentLinks = planet.residents.map(resident => {
      const charIndex = req.characters.findIndex(character => {
        return character.url === resident;
      });
      return req.characters[charIndex].name;
    });
    planet.residents = replacedResidentLinks;
    return planet;
  });
  res.status(200).send(mappedPlanets);
});

// I would normally store the port number in a .env file however I have omitted this step for simplicity
app.listen(serverPort, () =>
  console.log(`Server is running on port ${serverPort}`)
);
