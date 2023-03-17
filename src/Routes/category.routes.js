const router = require('express').Router()
const {getCategories,createCategory,deleteCategory,updateCategory}=require('../Controllers/categoryController')
const auth = require('../Middlewares/auth')
const authAdmin = require('../Middlewares/authAdmin')


router.route('/category').get( getCategories).post(auth,authAdmin,createCategory)

router.route('/category/:id').delete(auth,authAdmin,deleteCategory).put(auth,authAdmin,updateCategory)





module.exports = router