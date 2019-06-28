const xss = require('xss')

const UserService = {
  getAllUser(knex) {
    return knex.select('*').from('users')
  },

  getUserById(knex, user_id) {
    return knex
      .from('users')
      .select('*')
      .where('id', user_id)
      .first()
  },

  deleteUser(knex, user_id) {
    return knex('users')
      .where('id', user_id)
      .delete()
  },

  updateUser(knex, id, newUserFields) {
    return knex('users')
      .where({ id })
      .update(newUserFields)
  },

  getUserGroupRef(knex, group_id, user_id) {
    // return knex('usergroupref').select(1)
    return knex('usergroupref').select('*')
    .where({
      user_id: user_id,
      group_id: group_id
    }).first()
  },

  insertUserGroupRef(knex, group_id, user_id) {
    console.log(group_id)
    return knex
    .insert([
      {user_id: user_id,
       group_id: group_id,
       points: 0
     },
    ])
    .into('usergroupref')
    .returning('*')
    .then(rows => {
      return rows[0]
    })
  },

  getSumCompletedChallengesForUser(knex, group_id, user_id) {
    console.log(group_id, user_id)
    return knex('completedchallenge')
    .sum('points')
    .where({
      user_id: user_id,
      group_id: group_id
    })
    .then(rows => {
      console.log(`SUM OF POINTS:`)
      console.log(rows)
      return rows[0].sum

    })
  },
// TODO: fix this, it's not updating the points.
  updateUserGroupRefPoints(knex, user_id, group_id, points) {
  return knex('usergroupref')
  .where({
    user_id: user_id,
    group_id: group_id
  })
  .update({points: points})
  .then(rows => {
    return rows
  })
  }

}

module.exports = UserService
