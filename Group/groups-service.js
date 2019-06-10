const xss = require('xss')

const GroupsService = {
  getAllGroups(knex) {
    return knex.select('*').from('groups')
  },

  getAllGroupsForUser(knex, id) {
    return knex.select('*').from('groups')
    .innerjoin('groupUsersRef', 'groups.id', 'groupUsersRef.group_id')
    .innerjoin('users', 'groupUsersRef.user_id', 'users.id')
    .where('users.id', id)
  },

  insertGroup(knex, newGroup) {
    return knex
      .insert(newGroup)
      .into('groups')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getGroupById(knex, id) {
    return knex
      .from('groups')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteGroup(knex, id) {
    return knex('groups')
      .where({ id })
      .delete()
  },

  updateGroup(knex, id, newGroupFields) {
    return knex('groups')
      .where({ id })
      .update(newGroupFields)
  },
  serializeChallenge(group) {
  const { user } = group
  return {
    id: group.id,
    name: xss(group.name),
    group_id: group.group_id,
    description: group.description,
    points: group.points,
    date_created: new Date(group.date_created),
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

module.exports = GroupsService
