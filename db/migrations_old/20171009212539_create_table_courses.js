'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTable('specialties', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('name')
                .notNullable();
            table
                .string('note');
            table
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();

        })
        .createTable('courses', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('name');
            table
                .string('note');
            table
                .integer('age')
                .notNullable();
            table
                .integer('year')
                .notNullable();
            table
                .bigInteger('specialty_id')
                .references('specialties.id')
                .notNullable();
            table
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();


            //-----------UNIQ KEY-----------
            table
                .unique(['year', 'age', 'specialty_id']);

        })
        .createTable('users_courses', function (table) {
            table.increments('id').primary();
            table.bigInteger('user_id').references('users.id').notNullable();
            table.bigInteger('course_id').references('courses.id').notNullable();
        })
};

exports.down = function (knex) {
    return knex.schema
        .raw('DROP TABLE courses')
        .raw('DROP TABLE users_courses CASCADE')
        .raw('DROP TABLE specialties');
};