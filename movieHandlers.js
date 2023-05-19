const database = require("./database");

const getMovies = (req, res) => {
  const sqlValue = [];
  
  let sql = "SELECT * FROM movies";
  if(sqlValue != null) {
    sql += " WHERE color = ?";
    sqlValue.push(req.query.color);
  }
  database
    .query(sql, sqlValue)
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
      else res.status(404).send("Not Found");
    })
    .catch((err) => {
      res.status(500).send("Error retrieving data from database");
      console.error(err);
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) =>
      res
        .location(`/api/movies/${result.insertId}`)
        .status(201)
        .send("movie successfully added")
    )
    .catch((err) => res.status(500).send("error to add the movie"));
};

const putMovie = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      "UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 1) {res.status(204);}
      else res.status(404).send("NOT FOUND");
    })
    .catch((err) => res.status(500).send("Error: Modification cancelled"));
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id, 10);
  database
    .query("DELETE FROM movies WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 1)
        res.status(200).send("deleted successfully");
      else res.status(404).send("Not Found");
    })
    .catch((err) => res.status(500).send("error : operation cancelled"));
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  putMovie,
  deleteMovie,
};
