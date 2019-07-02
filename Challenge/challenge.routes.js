// /challenge
const express = require('express')
const challengesRouter = express.Router()
const challengeController = require('./challenge.controller')
const ChallengesService = require('./challenges-service')
const jsonBodyParser = express.json()
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')
const GroupsService = require('../Group/groups-service')

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
  .route('/group/:group_id')
  .all(checkGroupExists)
  .get((req, res, next) => {
    ChallengesService.getChallengesInGroup(req.app.get('db'), req.params.group_id)
    .then(challenges => {
      res.status(200).json(challenges)
    })
    .catch(next)
  })

challengesRouter
  .route('/:challenge_id')
  .get((req, res, next) => {
    const knexInstance =
    ChallengesService.getById(req.app.get('db'), req.params.challenge_id)
      .then(challenge => {
        res.status(200).json({
          data: challenge
        })
      })
  })
  .delete((req, res, next) => {
    ChallengesService.deleteChallenge(req.app.get('db'), req.params.challenge_id)
      .then(challenge => res.status(200).json({data: challenge}))
  })

//client Admin only endpoint
challengesRouter
  .route('/create')
  .post(jsonBodyParser, (req, res, next) => {
    const { group_id, name, description, points } = req.body
    const newChallenge = { group_id, name, description, points }
    console.log(req.body)
    // for (const [key, value] of Object.entries(newChallenge))
    //   if (value == null)
    //     return res.status(400).json({
    //       error: `Missing '${key}' in request body`
    //     })
    ChallengesService.insertchallenge(req.app.get('db'), newChallenge)
    .then(challenge => {
      res.status(201).json({data: challenge})
      })
      .catch(next)
    })

challengesRouter
  .route('/complete/:challenge_id')
  .post(requireAuth, (req, res, next) => {
    //make sure that the challenge is not already completed
    const user_id = req.user.id
    const challenge_id = parseInt(req.params.challenge_id)
    const points = req.body.points
    const group_id = req.body.group_id
    console.log(`user_id: ${user_id}, challenge_id: ${challenge_id}, points: ${points}, group_id: ${group_id}`)
    ChallengesService.insertCompletedChallenge(req.app.get('db'), challenge_id, group_id, user_id, points)
    .then(challenge => {
      res.status(200).json({
        data: challenge
      })
    })
    .catch(next)
  })


/* async/await syntax for promises */
async function checkGroupExists(req, res, next) {
  try {
    const group = await GroupsService.getGroupById(
      req.app.get('db'),
      req.params.group_id
    )

    if (!group)
      return res.status(404).json({
        error: `Group doesn't exist`
      })

    res.group = group
    next()
  } catch (error) {
    next(error)
  }
}
//export routes
module.exports = challengesRouter
