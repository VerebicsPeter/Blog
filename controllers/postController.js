// Models
const Post = require('../models/post')
const Comment = require('../models/comment')

// Utils
const { isAuthorizedUser, getPaginationPrevNext } = require('../utils/utils')

// Mongoose for id validation
const mongoose = require('mongoose')

// Marked for rendering markdown
const { marked } = require('marked')

// JSDOM and DOM Purify for sanitizing marked HTML
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window
const Dompurify = require('dompurify')
const dompurify = Dompurify(window)

exports.postsIndex = async (req, res) => {
    const { page, limit } = req.pagination
    const posts = await Post.find().limit(limit).skip(limit * (page - 1))
    const count = await Post.count()

    const { prev, next } = getPaginationPrevNext(page, limit, count)

    res.render('posts/index', {
        posts,
        title: "Posts", category: 'post',
        page, prev, next,
    })

}

exports.postsIndexSearch = async (req, res) => {
    const { title } = req.query
    const limit = 5
    const posts = await Post.find({title: {'$regex': title}}).limit(limit)
    res.render('posts/index', {
        posts,
        title: "Posts", category: 'post',
        page: NaN, prev: NaN, next: NaN
    })
}

exports.createPostForm = (req, res) => {
    res.render('posts/new', {
        title: "New Post", category: 'new'
    })
}

exports.createPost = async (req, res) => {
    const { title, text } = req.body
    const { username } = req.session.user
    const post = new Post({username, title, text})

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
    const username = req.session.auth ? req.session.user.username : undefined
    const authorized = isAuthorizedUser(req.session,post.username)

    res.render('posts/show', {
        post, comments,
        title: post.title, category: 'post',
        username, authorized
    })
}

exports.editPostForm = async (req, res) => {
    const { id } = req.params
    const isId = mongoose.isValidObjectId(id)

    if (!isId) {res.redirect('/posts'); return}
    const post = await Post.findById(id)
    if (!post) {res.redirect('/posts'); return}

    const authorized = isAuthorizedUser(req.session, post.username)

    if (authorized) {
        res.render('posts/edit', {
            post,
            title: `Editing '${post.title}'`, category: 'post'
        })
    } else {
        res.redirect(`/posts/${id}`)
    }
}

exports.editPost = async (req, res) => {
    const { id } = req.params
    const { username } = req.session.user

    const post = await Post.findById(id)
    if ( !post || post.username !== username ) {res.redirect('/posts'); return}
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