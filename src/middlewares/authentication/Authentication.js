const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

async function Authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "acesso bloqueado" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
}

module.exports = Authenticate;
