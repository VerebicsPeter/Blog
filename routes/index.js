const express = require('express')

const router = express.Router()

// Controller
const controller = require('../controllers/indexController')

// Middleware
router.use(express.urlencoded({extended: true}))
router.use(express.json())

// Get home page
router.get('/', controller.home)

module.exports = router