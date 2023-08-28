const Comment = require('../models/comment')

exports.createComment = async (req, res) => {
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
    const comment = 
    await Comment.findOneAndDelete({_id: id, username: req.session.username})
    if (comment) {res.redirect(`/posts/${comment.post}`)}
    else         {res.redirect('/posts')}
}