const database = require("./database");

const getUsers = (req, res) => {
  const initialSql = "select id, firstname, lastname, email, city, language from users";
  const where = [];
  const params = req.query;

  if (params != null) {
    for (let i of Object.keys(params)) {
      where.push({ [i]: `${params[i]}` });
    }

    database
      .query(
        where.reduce(
          (sqlCommand, currentValue, index) =>
            `${sqlCommand} ${index === 0 ? "where" : "and"} ${Object.keys(
              currentValue
            )} = ?`,
          initialSql
        ),
        Object.values(params)
      )
      .then(([users]) => res.status(200).json(users))
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error : operation cancelled");
      });
  }
};
const getUserById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  database
    .query("select id, firstname, lastname, email, city, language from users where id = ?", [id])
    .then(([user]) => {
      user != null ? res.json(user[0]) : res.status(404).send("Not Found");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error while retrieving user ?", [id]);
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } = req.body;
  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) =>
      res
        .location(`/api/users/${result.insertId}`)
        .status(201)
        .send("user is added successfully")
    )
    .catch((err) => res.status(500).send("Error adding user"));
};

const putUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      result.affectedRows === 1
        ? res.status(200).send("Modified succesfully")
        : res.status(404).send("NOT FOUND");
    })
    .catch((err) => res.status(500).send("Error: operation cancelled"));
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id, 10);

  database
    .query("DELETE from users WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 1) res.status(200).send("deleted successfully");
      else res.status(400).send("NOT FOUND");
    })
    .catch((err) => res.status(500).send("Delete failed"));
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser,
};
