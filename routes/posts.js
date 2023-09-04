const express = require('express')
// Router
const router = express.Router()
// Controller
const controller = require('../controllers/postController')
// Utils
const { catchAsync, paginate } = require('../utils/utils')
// Middleware for handling errors
const { errorHandler } = require('../middleware/error')
// Middleware for setting locals
const { locals } = require('../middleware/locals')
// Middleware for authentication
const { auth } = require('../middleware/auth')
// Method Override for sending put and delete requests
const methodOverride = require('method-override')

// Middleware
router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(methodOverride('_method'))
router.use(errorHandler)
router.use(locals)

// Get post index page
router.get('/', catchAsync(paginate(controller.postsIndex)))

// Get post index page search
router.get('/search', catchAsync(controller.postsIndexSearch))

// Get post creation form
router.get('/new', auth, controller.createPostForm)

// Create post
router.post('/', auth, catchAsync(controller.createPost))

// Get post page
router.get('/:id', catchAsync(controller.showPost))

// Get post updating form
router.get('/:id/edit', auth, catchAsync(controller.editPostForm))

// Update post
router.put('/:id', auth, catchAsync(controller.editPost))

// Delete post
router.delete('/:id', auth, catchAsync(controller.deletePost))

module.exports = router