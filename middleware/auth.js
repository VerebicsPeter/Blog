exports.auth = (req, res, next) => {
    if (!req.session.auth) {res.redirect('/users/login'); return}
    next()
}