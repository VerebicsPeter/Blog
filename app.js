const express = require('express')
const session = require('express-session')
const path = require('path')
const port = 8000
const db = require('./db')

const app = express()

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')

db.connect()

// Middleware
app.use(session({ secret: 'thisisthesecret', resave: false, saveUninitialized: false }))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)

// Setters
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/*', (_req, res) => {
    res.status(404).send('page not found');
})

app.listen(port, 'localhost', () => {console.log(`Started listening on post ${port}.`)})