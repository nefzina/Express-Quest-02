const argon2 = require("argon2");

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

module.exports = {
  hashPassword,
};
