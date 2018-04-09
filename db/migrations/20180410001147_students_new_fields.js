const Promise = require('bluebird');


exports.up = function (knex, Promise) {
    //Users Table
    return knex.schema.table('students', function (table) {
        table.bigInteger('workspace_id').references('workspaces.id').onDelete('CASCADE');
        table.bigInteger('user_id').references('users.id').notNullable().onDelete('CASCADE');
        table.bigInteger('course_id').references('courses.id').onDelete('CASCADE');
        table.bigInteger('specialty_id').references('specialties.id').onDelete('CASCADE');
        table
            .timestamp("created_at")
            .defaultTo(knex.fn.now())
            .notNullable();
        table
            .timestamp("updated_at")
            .defaultTo(knex.fn.now())
            .notNullable();

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('students', function (table) {
        table.dropColumn('workspace_id');
        table.dropColumn('user_id');
        table.dropColumn('course_id');
        table.dropColumn('specialty_id');
        table.dropColumn('created_at');
        table.dropColumn('updated_at');

    })
};

exports.config = {
    transaction: true
};