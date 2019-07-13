const express = require('express')
const authRouter = express.Router()
const AuthService = require('./auth-service')
const jsonBodyParser = express.json()
const path = require('path')


authRouter
  .route('/register')
  .post(jsonBodyParser, (req, res, next) => {
    const { full_name, user_name, email, password } = req.body
    const newUser = { full_name, user_name, email, password }
    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
        //todo: add register created by user info
    const passwordError = AuthService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    AuthService.hasUserWithEmail(req.app.get('db'), email)
      .then(hasUserWithEmail => {
        if (hasUserWithEmail)
          return res.status(400).json({ error: `Email already used` })
        })
    AuthService.hasUserWithUserName(req.app.get('db'), user_name)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `User name already used` })

        return AuthService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              full_name,
              user_name,
              email,
              password: hashedPassword,
              date_created: 'now()',
            }

            return AuthService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(AuthService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })


authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { user_name, password } = req.body
    const loginUser = { user_name, password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.user_name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect user name or password',
          })

        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect user name or password',
              })

            const sub = dbUser.user_name
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(sub, payload),
            })
          })
      })
    .catch(next)
})

//export routes
module.exports = authRouter
