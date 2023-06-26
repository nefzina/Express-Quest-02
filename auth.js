const argon2 = require("argon2");
let jwt = require("jsonwebtoken");

async function hashPassword(req, res, next) {
  try {
    const hashedPassword = await argon2.hash(req.body.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 2,
      parallelism: 1,
    });
    req.body.hashedPassword = hashedPassword;
    delete req.body.password;
    next();
  } catch (error) {
    console.log(error);
  }
}

async function verifyPassword(req, res) {
  const isValidPassword = await argon2.verify(
    req.user.hashedPassword,
    req.body.password
  );

  if (req.user.email === "dwight@theoffice.com" && isValidPassword) {
    const payload = { sub: req.user.id };
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    delete req.user.hashedPassword;
    res.send({ token, user: req.user });
  } else res.sendStatus(401);
}

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("authorization");
    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] = authorizationHeader.split(" ");
    if (type !== "Bearer") {
      throw Error("Authorization haeder has not the Bearer type");
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET)
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
};
