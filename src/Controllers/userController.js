const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const search = await User.findOne({ email });
      if (search) return res.status(400).json({ message: "Ya existe un usuario registrado con este correo !!" });
      if (password.length < 8)
        return res.status(400).json({ message: "La contraseña debe tener mínimo 8 caracteres.!!" });

      const user = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 12),
      });

      //Save in the bdd mongoDB
      await user.save();

      //then create jsonwebToken to autentication
      const accessToken = createAccessToken({ id: user._id });
      //   console.log(accessToken);
      const refreshToken = createRefreshToken({ id: user._id });
      res.cookie("refreshToken", refreshToken, {
        //guardamos en cookies el refreshToken
        httpOnly: true,
        path: "/user/refresh_token", //configuraciones adicionales (seguridad)
      });
      // return res.status(200).json({ message: "Success! You have successfully registered" });
      return res.status(200).json({ message: "Usuario registrado correctamente!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "El usuario no existe" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Contraseña Incorrecta" });

      // If login is successfully completed

      const accessToken = createAccessToken({ id: user._id });
      //   console.log(accessToken);
      const refreshToken = createRefreshToken({ id: user._id });
      res.cookie("refreshToken", refreshToken, {
        //guardamos en cookies el refreshToken
        httpOnly: true,
        path: "/user/refresh_token", //configuraciones adicionales (seguridad)
      });
      res.json({ accessToken });
      // return res.status(200).json({ message: "Login Success!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/user/refresh_token" });
      return res.json({ message: "Sesion cerrada!!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  refreshToken: (req, res) => {
    try {
      const rf_Token = req.cookies.refreshToken; //obtenemos de cookies al refreshToken
      if (!rf_Token) return res.status(400).json({ message: "Por favor inicia sesion o registrate" });
      jwt.verify(rf_Token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        //verificamos el refreshToken del registro con el paiload del .env
        if (err) return res.status(400).json({ message: "Por favor inicia sesion o registrate" });
        const accessToken = createAccessToken({ id: user.id });
        // res.json({user,accessToken})
        res.json({ accessToken });
      });
      //    res.json({rf_Token})
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      //El req.user es el que guardamos en el auth sacado del payload
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ message: "El usuario no existe !" });

      res.json({ user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      if (!users) return res.status(400).json({ message: "No hay usuarios registrados" });
      res.json({ users });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, password } = req.body;
      const newPassword = undefined;
      // console.log(typeof newPassword);
      if (password) newPassword = bcrypt.hashSync(password, 12);
      await User.findByIdAndUpdate(id, { name, email, password: newPassword })
      console.log( name, email, password);
      res.status(200).json({ message: "El usuario ha sido actualizado" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "El usuario ha sido eliminado correctamente" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userController;
