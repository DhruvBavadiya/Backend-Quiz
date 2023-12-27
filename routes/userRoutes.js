const express = require("express")
const { addUser, Login, fetch ,forgetPassword, resetpassword, Logout, allUsers, Submit, updateUser } = require("../controller/userController")

const router = express.Router()

router.post('/signup',addUser)
router.post('/login',Login)
router.post('/user',fetch)
router.get('/alluser',allUsers)
router.get('/logout',Logout)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetpassword)
router.post('/submit',Submit)
router.put('/update',updateUser)

module.exports = router