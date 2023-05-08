const database = require("./database");

const getMovies = (req, res) => {
  database.query("select * from movies")
  .then(([movies]) => res.json(movies))
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error retrieving data from database");
});
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);
  
    database
      .query(`select * from movies where id = ?`, [id])
      .then(([movie]) => {
        if (movie != null) res.json(movie);
        else res.status(404).send("Not Found");})
      .catch(err => {
        res.status(500).send("Error retrieving data from database");
        console.error(err)});
  }

const postMovie = (req, res) => {
  const {title, director, year, color, duration} = req.body;
  
  database
  .query("INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)", [title, director, year, color, duration])
  .then(([result]) => res.location(`/api/movies/${result.insertId}`).status(201).send("movie successfully added"))
  .catch(err => res.status(500).send("error to add the movie"))
}

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id, 10);
  database.query("DELETE FROM movies WHERE id = ?", [id])
  .then(([result]) => {res.status(200).send("Movie deleted successfully"); console.log(result);})
  .catch(err => res.status(500).send("error while deleting the movie"))
}

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  deleteMovie
};
