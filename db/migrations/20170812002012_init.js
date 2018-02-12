'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTable('roles', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('name')
                .notNullable()
                .unique();
        })

        .createTable('photos', function (table) {
            table
                .increments('id')
                .primary();
        })
        .createTable('users', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('phone')
            table
                .string('email')
                .unique();
            table
                .string('password');
            table
                .integer('status')
                .notNullable();
        })
        .createTable('roles_users', function (table) {
            table.increments('id').primary();
            table.bigInteger('user_id').references('users.id').notNullable();
            table.bigInteger('role_id').references('roles.id').notNullable();
        })
        .createTable('profiles', function (table) {
            table
                .increments('id')
                .primary();
            table
                .integer('user_id')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            table
                .string('gender');
            table
                .string('fname');
            table
                .string('lname');
        })
        .createTable('settings', function (table) {
            table
                .increments('id')
                .primary();
            table
                .integer('user_id')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            table
                .string('language')
                .notNullable()
                .defaultTo('eng');
            table
                .boolean('notifications')
                .notNullable()
                .defaultTo(true);
        })
};

exports.down = function (knex) {
    return knex.schema
        .raw('DROP TABLE roles CASCADE')
        .raw('DROP TABLE users CASCADE')
        .dropTable('profiles')
        .dropTable('settings')
};
