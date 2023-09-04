const express = require('express')
// Router
const router = express.Router()
// Controller
const controller = require('../controllers/indexController')
// Middleware and utils
const {  catchAsync  } = require('../utils/utils')
const { errorHandler } = require('../middleware/error')
const { locals } = require('../middleware/locals')

// Middleware
router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(errorHandler)
router.use(locals)

// Get home page
router.get('/', catchAsync(controller.home))

module.exports = router