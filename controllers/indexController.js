const Post = require('../models/post')

exports.home = async (req, res) => {
    let posts = []

    if (req.session.auth) {
        posts = await Post.find({username: req.session.username})
    }

    res.render('home', {
        title: "Home", posts,
        auth: req.session.auth, username: req.session.username
    })
    console.log(`username: ${req.session.username}`)
}