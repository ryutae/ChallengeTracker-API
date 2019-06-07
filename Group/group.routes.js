// /challenge
const express = require('express')
const groupRoutes = express.Router()
const groupController = require('./group.controller')
const GroupsService = require('./groups-service')
const jsonBodyParser = express.json()
const path = require('path')

groupRoutes
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    GroupsService.getAllGroupsForUser(knexInstance, id)
      .then(groups => {
        res.status(200).json({
          data: groups
        })
      })
      .catch(next)
  })





//export routes
module.exports = groupRoutes
