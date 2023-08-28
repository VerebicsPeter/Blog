const express = require('express')

// Controller
const controller = require('../controllers/indexController')
const {  catchAsync  } = require('../middleware/utils')
const { errorHandler } = require('../middleware/error')

// Router
const router = express.Router()

// Middleware
router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(errorHandler)

// Get home page
router.get('/', catchAsync(controller.home))

module.exports = router