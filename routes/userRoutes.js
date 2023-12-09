const express = require("express")
const { addUser, Login, fetch ,forgetPassword, resetpassword, Logout, allUsers, Submit } = require("../controller/userController")

const router = express.Router()

router.post('/signup',addUser)
router.post('/login',Login)
router.get('/user',fetch)
router.get('/alluser',allUsers)
router.get('/logout',Logout)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetpassword)
router.post('/submit',Submit)

module.exports = router