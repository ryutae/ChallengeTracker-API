require('dotenv').config()

const knex = require('knex')
const app = require('./app')
const { DB_URL } = require('./config')
const PORT = process.env.PORT || 8000
//database
const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

//run server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)})
