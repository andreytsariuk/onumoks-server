
const md5 = require('md5');
const Promise = require('bluebird');
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries

  // Inserts seed entries
  return Promise.all([
    knex('users').del(),
    knex('admins').del()
  ])
    .then(() => knex('users')
      .insert({
        id: 1,
        email: 'test@test.com',
        password: md5('test_test')
      }))
    .then(() => knex('admins').insert({
      id: 1
    }))
    .then(() => knex('roles').insert({
      id: 1,
      user_id: 1,
      role_type: 'admins',
      role_id: 1
    }));
};