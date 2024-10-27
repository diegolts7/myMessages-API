const jwt = require("jsonwebtoken");

const AuthTokenPassword = (req, res, next) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ msg: "O token não foi passado!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_RECOVER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(500).json("Acesso negado, você não pode fazer essa ação!");
  }
};

module.exports = AuthTokenPassword;
