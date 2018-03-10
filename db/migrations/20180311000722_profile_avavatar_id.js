const Promise = require('bluebird');


exports.up = function (knex, Promise) {
    //Users Table
    return knex.schema.table('profiles', function (table) {
        table.bigInteger('avatar_id').references('avatars.id').onDelete('CASCADE');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('profiles', function (table) {
        table.dropColumn('avatar_id');
    })
};

exports.config = {
    transaction: true
};