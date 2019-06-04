// /challenge
const express = require('express')
const challengesRouter = express.Router()
const challengeController = require('./challenge.controller')
const ChallengesService = require('./challenges-service')
const jsonBodyParser = express.json()

challengesRouter
  .route('/all')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ChallengesService.getAllChallenges(knexInstance)
      .then(challenges => {
        res.status(200).json({
          data: challenges
        })
      })
      .catch(next)
  })

challengesRouter
  .route('/one/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ChallengesService.getById(knexInstance, req.params.id)
      .then(challenge => {
        res.status(200).json({
          data: challenge
        })
      })
  })
  .delete((req, res, next) => {
    ChallengesService.deletechallenge(req.app.get('db'), req.params.id)
      .then(challenge => res.status(200))
  })

challengesRouter
  .route('/create')
  .post(jsonBodyParser, (req, res, next) => {
    const { name, description, points } = req.body
    const newChallenge = { name, description, points }
    for (const [key, value] of Object.entries(newChallenge))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    ChallengesService.insertchallenge(req.app.get('db'), newChallenge)
    .then(challenge => {
      res.status(201)
      .location(path.posix.join(req.originalUrl, `/${challenge.id}`))
          .json(ChallengesService.serializeChallenge(challenge))
      })
      .catch(next)
    })
  
//export routes
module.exports = challengesRouter
