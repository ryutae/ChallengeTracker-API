const xss = require('xss')

const ChallengesService = {
  getAllChallenges(knex) {
    return knex.select('*').from('challenges')
  },

  insertchallenge(knex, newchallenge) {
    return knex
      .insert(newchallenge)
      .into('challenges')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex
      .from('challenges')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteChallenge(knex, id) {
    return knex('challenges')
      .where({ id })
      .delete()
  },

  getChallengesInGroup(knex, group_id) {
    return knex.select('*').from('challenges')
    .where('group_id', group_id)
  },

  updatechallenge(knex, id, newchallengeFields) {
    return knex('challenges')
      .where({ id })
      .update(newchallengeFields)
  },

  insertCompletedChallenge(knex, challenge_id, group_id, user_id, points) {
    return knex
    .insert(
      {user_id: user_id,
      group_id: group_id,
      challenge_id: challenge_id,
      points: points
    })
    .into('completedchallenge')
    .returning('*')
    .then(rows => {
      return rows[0]
    });
  },

  getUserGroupPointSum(knex, user_id, group_id) {
    return knex('completedchallenge')
    .sum('points')
    .where({
      user_id: user_id,
      group_id: group_id
    })
  },

  updateUserGroupRefPoints(knex, user_id, group_id) {
  //   return knex('usergroupref')
  //   .update({
  //     points: points
  //   })
  //   .where({
  //     user_id: user_id,
  //     group_id: group_id
  //   })
  // }

  return knex.raw(`update usergroupref set points = (select sum(points) from completedchallenge where user_id =${user_id} and group_id = ${group_id}) where user_id = ${user_id} and group_id = ${group_id}`)
}
  ,

  serializeChallenge(challenge) {
  const { user } = challenge
  return {
    id: challenge.id,
    name: xss(challenge.name),
    challenge_id: challenge.challenge_id,
    description: challenge.description,
    points: challenge.points,
    date_created: new Date(challenge.date_created),
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
      date_created: new Date(user.date_created),
      date_modified: new Date(user.date_modified) || null
    },
  }
}
}

module.exports = ChallengesService
