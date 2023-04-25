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

module.exports = {
  getMovies,
  getMovieById,
};
