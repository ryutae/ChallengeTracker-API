const knex = require('knex')
const app = require('./app')
const { DB_URL } = require('./config')

//database
const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

//run server
app.listen(2222, () => {
  console.log('Server is listening on port 2222')
})
