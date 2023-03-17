
const User = require("../Models/User");

const authAdmin = async (req, res, next) => {
  try {
    //Get user information by id
    const user = await User.findById(req.user.id)   //req.user.id  ----> este req.user viene de 
    if (user.role === "gestor") return res.status(404).json({ message: "No se puede realizar esta operacion, porque no eres Administrador" });
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = authAdmin;
