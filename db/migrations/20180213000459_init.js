'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('email')
                .notNullable()
                .unique();
            table
                .string('password');
        })
        .createTable('roles', function (table) {
            table
                .increments('id')
                .primary();
            table
                .bigInteger('user_id')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');

            table
                .bigInteger('role_id')
                .notNullable()
            table
                .string('role_type')
                .notNullable()

            table
                .unique(['user_id', 'role_id', 'role_type']);
        })

        .createTable('students', function (table) {
            table
                .increments('id')
                .primary();
            table
                .bigInteger('user_id')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE')
                .unique();
        })
        .createTable('lectors', function (table) {
            table
                .increments('id')
                .primary();
            table
                .bigInteger('user_id')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE')
                .unique();
        })
        .createTable('admins', function (table) {
            table
                .increments('id')
                .primary();
            table
                .bigInteger('user_id')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE')
                .unique();
        })
        .createTable('profiles', function (table) {
            table
                .increments('id')
                .primary();
            table
                .bigInteger('user_id')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            table
                .string('gender');
            table
                .string('fname');
            table
                .string('lname');
            table
                .string('personal_phone');
            table
                .string('work_phone');
            table
                .string('personal_email');
            table
                .string('work_email');
        })
        .createTable('settings', function (table) {
            table
                .increments('id')
                .primary();
            table
                .bigInteger('user_id')
                .notNullable()
                .references('users.id')
                .onDelete('CASCADE');
            table
                .string('language')
                .notNullable()
                .defaultTo('eng');
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('roles')
        .dropTable('students')
        .dropTable('lectors')
        .dropTable('admins')
        .dropTable('profiles')
        .dropTable('settings')
        .dropTable('users')
};
