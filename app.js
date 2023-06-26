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
const validators = require("./validators");
const authentication = require("./auth");

// the public routes
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", authentication.hashPassword, userHandlers.postUser); 
app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext, authentication.verifyPassword);

// Protected routes
app.use(authentication.verifyToken);

app.post("/api/movies", movieHandlers.postMovie); //validators.movieValidator, 
app.put("/api/movies/:id", movieHandlers.putMovie); //validators.movieValidator, 
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.put("/api/users/:id", userHandlers.putUser);
app.delete("/api/users/:id", userHandlers.deleteUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
