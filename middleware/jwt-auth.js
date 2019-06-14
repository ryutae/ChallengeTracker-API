const AuthService = require('../Auth/auth-service')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let bearerToken
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }


    const payload = AuthService.verifyJwt(bearerToken)
    console.log('====================')
    console.log(payload)
    AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub,
    )
      .then(user => {
        if (!user)
          return res.status(401).json({ error: 'Unauthorized request' })

        req.user = user
        next()
      })
      .catch(err => {
        console.error(err)
        next(err)
      })
  
}

module.exports = {
  requireAuth,
}
