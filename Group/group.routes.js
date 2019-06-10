// /challenge
const express = require('express')
const groupRoutes = express.Router()
const groupController = require('./group.controller')
const GroupsService = require('./groups-service')
const jsonBodyParser = express.json()
const path = require('path')

groupRoutes
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

groupRoutes
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params
      GroupsService.getGroupById(req.app.get('db'), id)
      .then(groups => {
        res.status(200).json({
          data: groups
        })
      })
      .catch(next)
  })

groupRoutes
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

//export routes
module.exports = groupRoutes
