//require all libraries
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const challengeRoutes = require('./Challenge/challenge.routes')
const groupRoutes = require('./Group/group.routes')
const bodyParser = require('body-parser')
//create and config app
const app = express()
const cors = require('cors');
const knex = require('knex')
const { NODE_ENV, DB_URL } = require('./config')

//middleware
app.use(helmet())
app.use(morgan('dev'))
app.use(cors());

app.use(bodyParser.json())

//routes
app.use('/challenge', challengeRoutes)
app.use('/groups', groupRoutes)

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
