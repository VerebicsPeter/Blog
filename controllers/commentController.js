const Comment = require('../models/comment')

exports.createComment = async (req, res) => {
    if (!req.session.auth) {res.redirect('/login')}
    
    const { post } = req.params
    const { comment } = req.body
    const newComment = new Comment({
        username: req.session.username, post, comment
    })
    await newComment.save()
    res.redirect(`/posts/${post}`)
}

exports.deleteComment = async (req, res) => {
    const { id } = req.params
    if (!req.session.auth) {res.redirect('/login'); return}
    
    const comment = await Comment.findByIdAndRemove(id)
    if (comment) {res.redirect(`/posts/${comment.post}`); return}
    res.redirect('/posts')
}