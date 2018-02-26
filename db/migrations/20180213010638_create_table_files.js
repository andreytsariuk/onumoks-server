'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTable('files', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('title');
            table
                .bigInteger('file_id')
                .notNullable();
            table
                .string('file_type')
                .notNullable();
            table
                .bigInteger('user_id')
                .references('users.id');
            table
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();

            table
                .unique(['file_id', 'file_type']);
        })
        .createTable('books', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('mime_type');
            table
                .string('name')
                .notNullable();
            table
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();

            table
                .unique(['name', 'mime_type']);
        })
        .createTable('images', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('mime_type');
            table
                .string('name')
                .notNullable();
            table
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();

            table
                .unique(['name', 'mime_type']);
        })
        .createTable('documents', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('mime_type');
            table
                .string('name')
                .notNullable();
            table
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();

            table
                .unique(['name', 'mime_type']);
        })
        .createTable('avatars', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('mime_type');
            table
                .string('name')
                .notNullable();
            table
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();

            table
                .unique(['name', 'mime_type']);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('documents')
        .dropTable('images')
        .dropTable('books')
        .dropTable('avatars')
        .dropTable('files');
};