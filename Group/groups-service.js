const xss = require('xss')

const GroupsService = {
  getAllGroups(knex) {
    return knex.select('*').from('groups')
  },

  getAllGroupsForUser(knex, id) {
    return knex.select('*').from('groups')
    .innerjoin('UserGroupRef', 'groups.id', 'UserGroupRef.gid')
    .innerjoin('users', 'UserGroupRef.uid', 'users.id')
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

  getUserGroup(knex, group_id, user_id) {
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
