const router = require('express').Router()
const {getCategories,createCategory,deleteCategory,updateCategory}=require('../Controllers/categoryController')
const auth = require('../Middlewares/auth')
const authAdmin = require('../Middlewares/authAdmin')


router.route('/category').get( getCategories).post(auth,createCategory)

router.route('/category/:id').delete(auth,deleteCategory).put(auth,updateCategory)





module.exports = router