const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAdminToken = (userID) => {
  const token = jwt.sign({ userID, admin: true }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

const generateToken = (userID) => {
  const token = jwt.sign({ userID, admin: false }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

const verifyJWT = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Token inválido: " + err });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Token no proporcionado." });
  }
};

const verifyAdminJWT = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res
      .status(403)
      .json({ message: "Acceso de administrador requerido." });
  }
  next();
};

module.exports = {
  generateAdminToken,
  verifyJWT,
  verifyAdminJWT,
  generateToken,
};
