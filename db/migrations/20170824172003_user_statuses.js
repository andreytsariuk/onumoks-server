'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTable('statuses', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('name')
                .notNullable()
                .unique();
            table
                .string('title')
                .notNullable()
        })
        .createTable('users_statuses', function (table) {
            table.increments('id').primary();
            table.bigInteger('user_id').references('users.id').notNullable();
            table.bigInteger('status_id').references('statuses.id').notNullable();
        })
};

exports.down = function (knex) {
    return knex.schema
        .raw('DROP TABLE statuses')
        .raw('DROP TABLE users_statuses CASCADE')
};
