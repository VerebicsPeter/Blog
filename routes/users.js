const express = require('express')
// Router
const router = express.Router()
// Controller
const controller = require('../controllers/userController')
// Middleware and utils
const {  catchAsync  } = require('../utils/utils')
const { errorHandler } = require('../middleware/error')
const { locals } = require('../middleware/locals')

// Middleware
router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(errorHandler)
router.use(locals)

// Get sign up form
router.get('/signup', controller.signUpForm)

// Register user into db
router.post('/signup', catchAsync(controller.signUpUser))

// Get login form
router.get('/login', controller.loginForm)

// Login with user
router.post('/login', catchAsync(controller.loginUser))

// Log out user
router.get('/logout', controller.logoutUser)

module.exports = router