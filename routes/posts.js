const express = require('express')
const methodOverride = require('method-override')
const router = express.Router()

// Controller
const controller = require('../controllers/postController')

// Middleware
const { paginate } = require('../middleware/paginate')
router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(methodOverride('_method'))

// Get post index page
router.get('/', paginate(controller.postsIndex))

// Post index page search
router.get('/search', controller.postsIndexSearch)

// Save post
router.post('/', controller.createPost)

// Get post creation form
router.get('/new', controller.createPostForm)

// Get post page
router.get('/:id', controller.showPost)

// Get post updating form
router.get('/:id/edit', controller.editPostForm)

// Update post
router.put('/:id', controller.editPost)

// Delete post
router.delete('/:id', controller.deletePost)

module.exports = router