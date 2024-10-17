async function IsAdmin(req, res, next) {
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(401).json({ msg: "acesso restrito a administradores!" });
  }

  next();
}

module.exports = IsAdmin;
