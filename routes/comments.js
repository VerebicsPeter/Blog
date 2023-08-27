const express = require('express')

const router = express.Router()

// Controller
const controller = require('../controllers/commentController')

// Middleware
router.use(express.urlencoded({extended: true}))
router.use(express.json())

// Create comment
router.post('/:post/create', controller.createComment)

// Delete comment
router.post('/:id/delete', controller.deleteComment)

module.exports = router