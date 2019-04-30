//require all libraries
const express = require('express')
const morgan = require('morgan')
const challengeRoutes = require('./Challenge/challenge.routes')
const bodyParser = require('body-parser')
//create and config app
const app = express()

//middleware
app.use(morgan('dev'))
app.use(bodyParser.json())

//routes
app.use('/challenge', challengeRoutes)

//run server
app.listen(2222, () => {
  console.log('Server is listening on port 2222')
})
