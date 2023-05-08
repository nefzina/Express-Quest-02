const database = require("./database")

const getUsers = (req, res) => {
    database
    .query("select * from users")
    .then(([users]) => res.json(users))
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error while retrieving users");
    })
}
const getUserById = (req, res) => {
    const id = parseInt(req.params.id, 10)
    database
    .query("select * from users where id = ?", [id])
    .then((user) => {
        user[0][0] ? res.json(user): res.status(404).send("Not Found");})
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error while retrieving user ?", [id] )
    })
}

const postUser = (req, res) => {
    const {firstname, lastname, email, city, language} = req.body;
    database
    .query("INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)", [firstname, lastname, email, city, language])
    .then(([result]) => res.location(`/api/users/${result.insertId}`).status(201).send("user is added successfully"))
    .catch(err => res.status(500).send("Error adding user"))
}
module.exports={
    getUsers,
    getUserById,
    postUser,
}