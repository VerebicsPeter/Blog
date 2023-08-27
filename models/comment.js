const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    post: {
        type: String, required: true
    },
    username: {
        type: String, required: true
    },
    comment: {
        type: String, required: true
    }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment