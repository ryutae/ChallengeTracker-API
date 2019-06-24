// /challenge
const express = require('express')
const userRouter = express.Router()
const jsonBodyParser = express.json()
const path = require('path')
const UserService = require('../User/user-service')

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
  .route('/:user_id/:group_id')
  .get((req, res, next) => {
    const { group_id, user_id } = req.params
      UserService.getUserGroupRef(req.app.get('db'), group_id, user_id)
      .then(user => {
        res.status(200).json({
          data: user
        })
      })
      .catch(next)
  })

  module.exports = userRouter
