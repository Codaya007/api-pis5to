const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const generateToken = (payload, expiresIn = "7d") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn,
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = { generateToken };
