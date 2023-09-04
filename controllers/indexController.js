// Models
const Post = require('../models/post')

exports.home = async (req, res) => {
    let username = undefined 
    let posts    = []
    
    if (req.session.auth) {
        username = req.session.user.username
        posts    = await Post.find({username})
    }

    res.render('home', {
        posts,
        title: "Home", category: 'home',
        auth: req.session.auth, username
    })
}