const movieValidator = (req, res, next) => {
  const input = req.body;
  console.log(Object.values(input));
  movieKeys = ["title", "director", "year", "color", "duration"];
  error = [];
  if (Object.keys(input).sort().toString() === movieKeys.sort().toString()) {
    // if (Object.values(input).every((element) => element != null)) {next();}
    if (Object.values(input).some((element) => element === '')){
      Object.keys(input).forEach((element) => {
        console.log(input[element]);
        if (input[element] == null || input[element] == "")
          res.status(422).send(`Value required for "${element}" field`);
      });
    }
  } else {
    movieKeys.map((item) => {
      if (!Object.keys(input).includes(item))
        error.push(`"${item}" field is missing`);
    });
    res.status(422).send(`${error.map((i) => i + "\n")}`);
  }
};

module.exports = { movieValidator };
