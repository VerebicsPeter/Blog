const express = require('express')

const router = express.Router()

// Controller
const controller = require('../controllers/commentController')

const {  catchAsync  } = require('../middleware/utils')
const { errorHandler } = require('../middleware/error')
const { auth } = require('../middleware/auth')

// Middleware
router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(errorHandler)

// Create comment
router.post('/:post/create', auth, catchAsync(controller.createComment))

// Delete comment
router.post('/:id/delete', auth, catchAsync(controller.deleteComment))

module.exports = router