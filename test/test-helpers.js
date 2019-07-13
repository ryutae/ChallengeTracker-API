const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      email: 'test1@test.com',
      password: 'P@ssw0rd',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      email: 'test2@test.com',
      password: 'P@ssw0rd',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeGroupsArray(users) {
  return [
    {
      id: 1,
      name: 'Group 1',
      description: 'group 1',
      created_by: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      name: 'Group 2',
      description: 'group 2',
      created_by: users[1].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    }
  ]
}

function makeChallengesArray(groups) {
  return [
    {
      id: 1,
      group_id: groups[0].id,
      name: 'Challenge 1',
      descrition: 'First',
      points: 10,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      group_id: groups[0].id,
      name: 'Challenge 1',
      descrition: 'First',
      points: 10,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      group_id: groups[1].id,
      name: 'Challenge 3',
      descrition: 'Third',
      points: 10,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      group_id: groups[1].id,
      name: 'Challenge 4',
      descrition: 'Fourth',
      points: 10,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeGroupsFixtures() {
  const testUsers = makeUsersArray()
  const testGroups = makeGroupsArray(testUsers)
  const testChallenges = makeChallengesArray(testUsers, testGroups)
  return { testUsers, testGroups, testChallenges }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        users,
        groups,
        challenges,
        usergroupref,
        completedchallenge
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE groups_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE challenges_id_seq minvalue 0 START WITH 1`),
        // trx.raw(`ALTER SEQUENCE usergroupref_id_seq minvalue 0 START WITH 1`),
        // trx.raw(`ALTER SEQUENCE completedchallenge_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
        trx.raw(`SELECT setval('groups_id_seq', 0)`),
        trx.raw(`SELECT setval('challenges_id_seq', 0)`),
        // trx.raw(`SELECT setval('usergroupref_id_seq', 0)`),
        // trx.raw(`SELECT setval('completedchallenge_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedGroupsTables(db, users, groups, challenges=[]) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('groups').insert(groups)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('groups_id_seq', ?)`,
      [groups[groups.length - 1].id],
    )
    // only insert comments if there are some, also update the sequence counter
    if (challenges.length) {
      await trx.into('challenges').insert(challenges)
      await trx.raw(
        `SELECT setval('challenges_id_seq', ?)`,
        [challenges[challenges.length - 1].id],
      )
    }
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeGroupsArray,
  makeChallengesArray,
  makeGroupsFixtures,
  cleanTables,
  makeAuthHeader,
  seedUsers,
  seedGroupsTables
}
