
const md5 = require('md5');
const Promise = require('bluebird');
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries

  // Inserts seed entries
  return Promise.all([
    knex('workspaces').del(),
    knex('avatars').del(),
    knex('users').del(),
    knex('admins').del()
  ])
    .then(() => knex('avatars').insert({
      id: 1,
      mime_type: 'image/png',
      name: 'onumoks_logo.png'
    }))
    .then(() => knex('workspaces')
      .insert({
        id: 1,
        name: 'onumoks',
        avatar_id: 1
      }))
    .then(() => knex('users')
      .insert({
        id: 1,
        email: 'test@test.com',
        password: md5('test_test'),
        workspace_id: 1
      }))
    .then(() => knex('admins').insert({
      id: 1
    }))
    .then(() => knex('roles').insert({
      id: 1,
      user_id: 1,
      role_type: 'admins',
      role_id: 1
    }))
    ;
};