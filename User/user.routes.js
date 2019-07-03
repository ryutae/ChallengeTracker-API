// /challenge
const express = require('express')
const userRouter = express.Router()
const jsonBodyParser = express.json()
const path = require('path')
const UserService = require('../User/user-service')
const { requireAuth } = require('../middleware/jwt-auth')

userRouter
  .route('/:user_id')
  .get((req, res, next) => {
    const { user_id } = req.params
      UserService.getUserById(req.app.get('db'), user_id)
      .then(user => {
        res.status(200).json({
          data: user
        })
      })
      .catch(next)
  })

userRouter
  .route('/group/:group_id')
  .all(requireAuth)
  .get((req, res, next) => {
    const { group_id } = req.params
    const user_id = req.user.id
      UserService.getUserGroupRef(req.app.get('db'), group_id, user_id)
      .then(user => {
        if (!user) {
          res.status(200).json({
            user_id: user_id,
            group_id: group_id,
            points: null,
            full_name: null,
            user_name: null,
            email: null,
            userInGroup: false
          })
        }
        res.status(200).json({
          user_id: user.user_id,
          group_id: user.group_id,
          points: user.points,
          full_name: user.full_name,
          user_name: user.user_name,
          email: user.email,
          userInGroup: true
        })
      })
      .catch(next)
  })

userRouter
  .route('/updatepoints')
  .patch(requireAuth, (req, res, next) => {
    const user_id = req.user.id
    const group_id = req.body.group_id
    let gpoints = 0
 UserService.getSumCompletedChallengesForUser(req.app.get('db'), group_id, user_id)
 .then(points => {
    console.log(`==============getSumCompletedChallengesForUser: ${points}==============`)
    console.log(points)
    gpoints = points
    UserService.updateUserGroupRefPoints(req.app.get('db'), user_id, group_id, points)
  }
  )
  .then(response => {
    console.log(response)
    res.status(200).json({points: gpoints})
  }
  )
  })

  module.exports = userRouter
