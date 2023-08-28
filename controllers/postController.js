const Post = require('../models/post')
const Comment = require('../models/comment')

const mongoose = require('mongoose')

const { marked } = require('marked')
//marked.use({sanitize: true}) // don't use, deprecated
// JSDOM and DOM Purify for sanitizing marked HTML
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window
const Dompurify = require('dompurify')
const dompurify = Dompurify(window)

const getPaginationPrevNext = (page, limit, count) => {
    const prev = page > 1 ?             page - 1 : NaN
    const next = page * limit < count ? page + 1 : NaN
    return { prev, next }
}

exports.postsIndex = async (req, res) => {
    const { page, limit } = req.pagination
    const count = await Post.count()
    const posts = await Post.find().
    limit(limit).skip(limit * (page - 1))

    const { prev, next } = getPaginationPrevNext(page, limit, count)

    res.render('posts/index', {posts, title: "Posts", auth: req.session.auth,
    page, prev, next})
}

exports.postsIndexSearch = async (req, res) => {
    const { title } = req.query; const limit = 5
    const posts = await Post.find({title: {'$regex': title}}).limit(limit)
    res.render('posts/index', {posts, title: "Posts", auth: req.session.auth,
    page: NaN, prev: NaN, next: NaN})
}

exports.createPostForm = (req, res) => {
    res.render('posts/new', {title: "New Post", auth: req.session.auth})
}

exports.createPost = async (req, res) => {
    const { title, text } = req.body
    const post = new Post({username: req.session.username, title, text})

    await post.validate()
    await post.save()
    
    res.redirect(`/posts/${post.id}`)
}

exports.showPost = async (req, res) => {
    const { id } = req.params
    const isId = mongoose.isValidObjectId(id)

    if (!isId) {res.redirect('/posts'); return}

    let post = await Post.findById(id)
    if (!post) {res.redirect('/posts'); return}

    post.text = dompurify.sanitize(marked.parse(post.text)) // sanitized HTML

    const comments = await Comment.find({post: id})
    const authorized = post.username === req.session.username

    res.render('posts/show', {
        post, title: post.title, 
        auth: req.session.auth, username: req.session.username,
        authorized, comments
    })
}

exports.editPostForm = async (req, res) => {
    const { id } = req.params
    const isId = mongoose.isValidObjectId(id)

    if (!isId) {res.redirect('/posts'); return}
    const post = await Post.findById(id)
    if (!post) {res.redirect('/posts'); return}

    const authorized = post.username === req.session.username

    if (authorized) {
        res.render('posts/edit', {
            post, title: `Editing '${post.title}'`, auth: req.session.auth
        })
    } else {
        res.redirect(`/posts/${id}`)
    }
}

exports.editPost = async (req, res) => {
    const { id } = req.params
    const post = await Post.findById(id)
    if ( !post || post.username !== req.session.username ) {
        res.redirect('/posts'); return                     }
    const newTitle = req.body.title
    const newText = req.body.text
    await
    Post.findByIdAndUpdate(id,
        {title: newTitle, text: newText},
        {runValidators: true})
    res.redirect(`/posts/${id}`)
}

exports.deletePost = async (req, res) => {
    const { id } = req.params
    
    await
    Post.findByIdAndDelete(id)
    await
    Comment.deleteMany({post: id})
        
    res.redirect('/posts')   
}