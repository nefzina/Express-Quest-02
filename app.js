const express = require("express");
require('dotenv').config()
const app = express();
const port = process.env.APP_PORT ?? 5000;
app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie & users lists");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/movies", movieHandlers.postMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);



app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", userHandlers.postUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
