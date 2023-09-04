// Models
const Comment = require('../models/comment')

exports.createComment = async (req, res) => {
    const { post } = req.params
    const { comment } = req.body
    const { username } = req.session.user
    
    const newComment = new Comment({ username, post, comment })
    await newComment.save()
    
    res.redirect(`/posts/${post}#comments`)
}

exports.deleteComment = async (req, res) => {
    const { id } = req.params
    const { username } = req.session.user
    
    const comment = await Comment.findOneAndDelete({_id: id, username})
    
    if (comment) {res.redirect(`/posts/${comment.post}#comments`)} else {res.redirect('/posts')}
}