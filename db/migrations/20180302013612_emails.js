const Promise = require('bluebird');

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('emails', function (table) {
            //Identity fields
            table.increments('id').primary();
            table
                .bigInteger("workspace_id")
                .notNullable()
                .references("workspaces.id")
                .onDelete("CASCADE");
            table.bigInteger('user_id').references('users.id').onDelete('CASCADE');
            table.string('type').notNullable();
            table.string('recipients');
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
            table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
        })

};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('emails');

};

exports.config = {
    transaction: true
};