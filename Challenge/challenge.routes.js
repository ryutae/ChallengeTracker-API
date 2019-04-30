// /challenge
const express = require('express')
const router = express.Router()
const challengeController = require('./challenge.controller')

router.get('/all', challengeController.getAllChallenges)


//export routes
module.exports = router
