const User = require('../models/user')

const bcrypt = require("bcrypt")

exports.users = (req, res) => { res.send('This will be the users page.') }

exports.signUpForm = (req, res) => {
    if (req.session.auth) {res.redirect('/'); return}
    
    const message = req.session.message
    req.session.message = undefined
    res.render('auth/signup', { title: "Sign up", message})
}

exports.signUpUser = async (req, res) => {
    const { username, password } = req.body
    
    const user = await User.findOne({username})
    // username already exists case
    if (user) {
        req.session.message = 'Username already exists!'
        res.redirect('/users/signup')
        return
    }
    const hash = await bcrypt.hash(password, 10)
    const newUser = new User({username, password: hash})
    await newUser.save()
    console.log(`${username} just signed up.`)
    res.redirect('/users/login')
}

exports.loginForm = (req, res) => {
    if (req.session.auth) {res.redirect('/'); return}
 
    const message = req.session.message
    req.session.message = undefined
    res.render('auth/login', { title: "Log in", message})
}

exports.loginUser = async (req, res) => {
    const { username, password } = req.body
    
    const user = await User.findOne({username})

    let matches = false

    if (user) { matches = await bcrypt.compare(password, user.password) }

    if (matches) {
        req.session.auth = true
        req.session.username = username
        res.redirect('/')
    } else {
        req.session.message = 'Wrong username or password!'
        res.redirect('/users/login')
    }
}

exports.logoutUser = (req, res) => {
    if (req.session.auth) {
        req.session.auth = false; req.session.username = undefined
    }
    res.redirect('/')
}