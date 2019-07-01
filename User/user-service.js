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
    return knex('usergroupref').innerJoin('users', 'usergroupref.user_id', 'users.id')
    .select(
      'usergroupref.group_id as group_id',
      'usergroupref.points as points',
      'users.id as user_id',
      'users.full_name as full_name',
      'users.user_name as user_name',
      'users.email as email')
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
