const jwt = require('jsonwebtoken')


const auth =(req,res,next)=>{
  try {

const token = req.header("Authorization")
  if (!token) return res.status(400).json({message: "Tú no estás autenticado"})
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
      if(err) return res.status(400).json({message: "Autenticación Inválida"})
      console.log("userr",user)
      req.user= user
      next();
  })
  } catch (error) {
      return res.status(500).json({message: error.message})
  }
}


module.exports = auth