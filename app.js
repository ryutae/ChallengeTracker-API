//require all libraries
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const challengeRouter = require('./Challenge/challenge.routes')
const groupRouter = require('./Group/group.routes')
const userRouter = require('./User/user.routes')
const authRouter = require('./Auth/auth.routes')
const bodyParser = require('body-parser')
require('dotenv').config()
//create and config app
const app = express()
const cors = require('cors');
const knex = require('knex')
const { NODE_ENV } = require('./config')
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
const {CLIENT_ORIGIN} = require('./config');

//middleware
app.use(helmet())
app.use(morgan(morganSetting))
app.use(cors())
app.use(bodyParser.json())

//routes
app.use('/api/challenges', challengeRouter)
app.use('/api/groups', groupRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.get('/', (req, res) => {
  res
    .send('Hello Express!');
});
//error handling
app.use(function errorHandler(error, req, res, next) {
   let response
   if (NODE_ENV === 'production') {
     response = { error: { message: 'server error' } }
   } else {
     console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
 })

module.exports = app
