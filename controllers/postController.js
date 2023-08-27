// TODO: error handling
const Post = require('../models/post')
const Comment = require('../models/comment')

const mongoose = require('mongoose')

const { marked } = require('marked'); marked.use({sanitize: true})

exports.postsIndex = async (req, res) => {
    try {
        const { page, limit } = req.pagination
        const count = await Post.count()
        const posts = await Post.find().
        limit(limit).skip(limit * (page - 1))

        const prev = page > 1             ? page - 1 : NaN
        const next = page * limit < count ? page + 1 : NaN

        res.render('posts/index', { posts, title: "Posts", auth: req.session.auth,
        page, prev, next })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message })
    }
}

exports.postsIndexSearch = async (req, res) => {
    const { title } = req.query
    const limit = 5
    const posts = await Post.find({title: {'$regex': title}}).limit(limit)
    res.render('posts/index', { posts, title: "Posts", auth: req.session.auth,
    page: NaN, prev: NaN, next: NaN})
}

exports.createPostForm = (req, res) => {
    if (!req.session.auth) {res.redirect('/users/login'); return}
    res.render('posts/new', { title: "New Post", auth: req.session.auth })
}

exports.createPost = async (req, res) => {
    if (!req.session.auth) {res.redirect('/posts'); return}
    
    const { title, text } = req.body
    const post = new Post({ username: req.session.username, title, text })
    await post.save()
    res.redirect(`/posts/${post.id}`)
}

exports.showPost = async (req, res) => {
    const { id } = req.params
    const isId = mongoose.isValidObjectId(id)

    if (!isId) {res.redirect('/posts'); return}

    let post = await Post.findById(id)
    if (!post) {res.redirect('/posts'); return}

    post.text = marked.parse(post.text)

    const editable = post.username === req.session.username
    const comments = await Comment.find({post: id})
    res.render('posts/show', {
        post, title: post.title, 
        auth: req.session.auth, username: req.session.username,
        editable, comments
    })
}

exports.editPostForm = async (req, res) => {
    const { id } = req.params
    const isId = mongoose.isValidObjectId(id)

    if (!isId) {res.redirect('/posts'); return}

    const post = await Post.findById(id)

    if (post.username === req.session.username) {
        res.render('posts/edit', {
            post, title: `Editing '${post.title}'`, auth: req.session.auth
        })
    } else {
        res.redirect(`/posts/${id}`)
    }
}

exports.editPost = async (req, res) => {
    if (!req.session.auth) {res.redirect('/posts'); return}
    
    const { id } = req.params
    const post = await Post.findById(id)
    if ( !post || post.username !== req.session.username ) {
        res.redirect('/posts')
    }
    const newTitle = req.body.title
    const newText  = req.body.text
    await
    Post.findByIdAndUpdate(id,
        {title: newTitle, text: newText},
        {runValidators: true})
    res.redirect(`/posts/${id}`)
}

exports.deletePost = async (req, res) => {
    if (!req.session.auth) {res.redirect('/posts'); return}
    
    const { id } = req.params
    await
    Post.findByIdAndDelete(id)
    await
    Comment.deleteMany({post: id})
    
    res.redirect('/posts')
}