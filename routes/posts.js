const express = require('express')
const methodOverride = require('method-override')

// Controller
const controller = require('../controllers/postController')
// Utils
const { catchAsync, paginate } = require('../utils/utils')
// Simple error handler middleware
const { errorHandler } = require('../middleware/error')
// Simple authentication middleware
const { auth } = require('../middleware/auth')

// Router
const router = express.Router()

// Middleware
router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(methodOverride('_method'))
router.use(errorHandler)

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