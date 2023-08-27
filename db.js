const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const URL = 'mongodb://127.0.0.1:27017/blog'

const connect = async () => {
 mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
 const db = mongoose.connection
 db.on('error', () => {
   console.log('Error while connecting to database.')
 })
 db.once('open', () => {
   console.log('Successfully connected to database.')
 })
}

module.exports = { connect }