const express = require('express')

const router = express.Router()

// Controller
const controller = require('../controllers/userController')

const {  catchAsync  } = require('../middleware/utils')
const { errorHandler } = require('../middleware/error')

// Middleware
router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(errorHandler)

// Query users
router.get('/', controller.users)

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