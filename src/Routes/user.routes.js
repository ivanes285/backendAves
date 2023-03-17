const router = require('express').Router();
const {register,refreshToken,login,logout,getUser,getUsers,updateUser,deleteUser}= require('../Controllers/userController')
const auth = require('../Middlewares/auth')
const authAdmin= require('../Middlewares/authAdmin')


router.post('/register',auth,authAdmin,register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/refresh_token',refreshToken)
router.get('/info',auth,getUser)
router.get('/users',getUsers)
router.put('/update/:id',auth, authAdmin,updateUser)
router.delete('/delete/:id',auth, authAdmin,deleteUser)


module.exports= router