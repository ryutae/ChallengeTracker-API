// /challenge
const express = require('express')
const challengesRouter = express.Router()
const challengeController = require('./challenge.controller')
const ChallengesService = require('./challenges-service')
const jsonBodyParser = express.json()
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')
const GroupsService = require('../Group/groups-service')
const moment = require('moment')

// Returns all challenges
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

// Gets challenges within group
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

// Gets challenge info, DELETE: deletes challenge
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
  .delete(requireAuth, (req, res, next) => {
    ChallengesService.deleteChallenge(req.app.get('db'), req.params.challenge_id)
      .then(challenge => res.status(204).json({data: challenge}))
  })

//Create Challenge 
challengesRouter
  .route('/create')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { group_id, name, description, points } = req.body
    const newChallenge = { group_id, name, description, points }
    ChallengesService.insertchallenge(req.app.get('db'), newChallenge)
    .then(challenge => {
      res.status(201).json({data: challenge})
      })
      .catch(next)
    })

//POST: post challenge to completedchallenge
challengesRouter
  .route('/complete/:challenge_id')
  .post(requireAuth, (req, res, next) => {
    //make sure that the challenge is not already completed
    const user_id = req.user.id
    const challenge_id = parseInt(req.params.challenge_id)
    const points = req.body.points
    const group_id = req.body.group_id
    ChallengesService.insertCompletedChallenge(req.app.get('db'), challenge_id, group_id, user_id, points)
    .then(challenge => {
      res.status(200).json({
        data: challenge
      })
    })
    .catch(next)
  })
  //GET:Check if the challenge has already been completed by user
  .get(requireAuth, (req, res, next) => {
    const user_id = req.user.id
    const challenge_id = parseInt(req.params.challenge_id)
    ChallengesService.checkChallengeCompleteByUser(req.app.get('db'), challenge_id, user_id)
    .then(challenge => {
      if (challenge.length === 0) {
        res.status(200).json({
          challengeComplete: false,
          date_completed: null
        })
        return
      }
      res.status(200).json({
        challengeComplete: true,
        date_completed: moment(challenge[0].date_completed).format("ddd, MMM D, YYYY")
      })
    })
    .catch(next)
  })

//Gets completed challenges by user
challengesRouter
  .route('/group/:group_id/completed')
  .get(requireAuth, (req, res, next) => {
    const user_id = req.user.id
    const { group_id } = req.params
    ChallengesService.getCompletedChallengesByUser(req.app.get('db'), user_id, group_id)
    .then(challenges => {
      res.status(200).json(challenges)
    })
  })

//Gets uncompleted challenges by user
challengesRouter
  .route('/group/:group_id/uncompleted')
  .get(requireAuth, (req, res, next) => {
    const user_id = req.user.id
    const { group_id } = req.params
    ChallengesService.getUncompletedChallengesByUser(req.app.get('db'), user_id, group_id)
    .then(challenges => {
      res.status(200).json(challenges)
    })
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
