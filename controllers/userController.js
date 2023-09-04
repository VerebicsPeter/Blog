// Models
const User = require('../models/user')

// Bcrypt for password encription
const bcrypt = require("bcrypt")

exports.signUpForm = (req, res) => {
    if (req.session.auth) {res.redirect('/'); return}
    // Set messages
    const warning_message = req.session.warning_message
    req.session.warning_message = undefined
    // Render page
    res.render('auth/signup', { title: "Sign up", category: 'none', warning_message })
}

exports.signUpUser = async (req, res) => {
    const { username, password } = req.body
    
    const user = await User.findOne({username})
    // Username already exists case
    if (user) {
        req.session.warning_message = 'Username already exists!'
        res.redirect('/users/signup')
        return
    }
    const hash = await bcrypt.hash(password, 10)
    const newUser = new User({username, password: hash})
    await newUser.save()
    req.session.success_message = 'Signed up successfuly.'
    res.redirect('/users/login')

    console.log(`${username} just signed up.`)
}

exports.loginForm = (req, res) => {
    if (req.session.auth) {res.redirect('/'); return}
    // Set messages
    const warning_message = req.session.warning_message
    const success_message = req.session.success_message
    req.session.warning_message = undefined
    req.session.success_message = undefined
    // Reder page
    res.render('auth/login', { title: "Log in", category: 'none', warning_message, success_message })
}

exports.loginUser = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({username})
    // true if a user provided the right password
    let matches = false

    if (user) { matches = await bcrypt.compare(password, user.password) }

    if (matches) {
        req.session.auth = true
        req.session.user = { username }
        res.redirect('/')
    } else {
        req.session.warning_message = 'Wrong username or password!'
        res.redirect('/users/login')
    }
}

exports.logoutUser = (req, res) => {
    if (req.session.auth) {
        req.session.destroy()
    }
    res.redirect('/')
}