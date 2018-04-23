const Promise = require('bluebird');


exports.up = function (knex, Promise) {
    //Users Table
    return knex.schema.table('lectors', function (table) {
        table.bigInteger('workspace_id').references('workspaces.id').onDelete('CASCADE');
        table.bigInteger('user_id').references('users.id').onDelete('CASCADE');
        table.bigInteger('position_id').references('positions.id').onDelete('CASCADE');

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
    return knex.schema.table('lectors', function (table) {
        table.dropColumn('workspace_id');
        table.dropColumn('user_id');
        table.dropColumn('position_id');
        table.dropColumn('created_at');
        table.dropColumn('updated_at');

    })
};

exports.config = {
    transaction: true
};