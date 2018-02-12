
const md5 = require('md5');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries

  // Inserts seed entries
  return knex('users')
    .insert({
      id: 1,
      email: 'test@test.com',
      password: md5('test_test'),
      status: 1
    })
    .then(() => Promise.all([
      knex('roles').insert({ name: 'master' }),
      knex('roles').insert({ name: 'admin' }),
      knex('roles').insert({ name: 'student' }),
      knex('roles').insert({ name: 'lector' })

    ]))
    .then(() => Promise.all([
      knex('roles_users').insert({ user_id: 1, role_id: 1 }),
      knex('roles_users').insert({ user_id: 1, role_id: 2 })
    ]))
    .then(() => Promise.all([
      knex('statuses').insert({
        id: 1,
        name: 'live',
        title: 'Live'
      }),
      knex('statuses').insert({
        id: 1,
        name: 'inactive',
        title: 'Inactive'
      })

    ])
      .then(() => Promise.all([
        knex('users_statuses').insert({ user_id: 1, status_id: 1 })
      ])));
};