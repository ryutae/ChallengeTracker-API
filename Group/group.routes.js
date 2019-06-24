// /challenge
const express = require('express')
const groupRouter = express.Router()
const groupController = require('./group.controller')
const GroupsService = require('./groups-service')
const jsonBodyParser = express.json()
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')

groupRouter
  .route('/all')
  .get((req, res, next) => {
      GroupsService.getAllGroups(req.app.get('db'))
      .then(groups => {
        res.status(200).json({
          data: groups
        })
      })
      .catch(next)
  })

groupRouter
  .route('/:group_id')
  .all(checkGroupExists)
  .get((req, res, next) => {
    const { group_id } = req.params
      GroupsService.getGroupById(req.app.get('db'), group_id)
      .then(groups => {
        res.status(200).json({
          data: groups
        })
      })
      .catch(next)
  })

  groupRouter
    .route('/join/:group_id')
    .all(checkGroupExists)
    .all(requireAuth)
    .all(checkUserInGroup)
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
      const group_id = parseInt(req.params.group_id)
      const user_id = req.user.id
        GroupsService.insertUserGroupRef(req.app.get('db'), group_id, user_id)
        .then(userGroup => {
          res.status(200).json({
            data: userGroup
          })
        })
        .catch(next)
    })

groupRouter
  .route('/create')
  .post(jsonBodyParser, (req, res, next) => {
    const { name, description } = req.body
    const newGroup = { name, description }
    for (const [key, value] of Object.entries(newGroup))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
        //todo: add group created by user info
    GroupsService.insertGroup(req.app.get('db'), newGroup)
    .then(group => {
      res.status(201)
      .location(path.posix.join(req.originalUrl, `/${group.id}`))
      .json({
        data: group
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

  async function checkUserInGroup(req, res, next) {
    try {
      console.log('=========user id ==========')
      console.log(req.user)
      const UserGroup = await GroupsService.getUserGroup(
        req.app.get('db'),
        req.params.group_id,
        req.user.id
      )

      if (UserGroup)
        return res.status(404).json({
          error: `User is already in group`
        })

      res.data = UserGroup
      next()
    } catch (error) {
      next(error)
    }
  }

//export routes
module.exports = groupRouter
