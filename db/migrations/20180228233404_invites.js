const Promise = require('bluebird');

exports.up = function (knex, Promise) {
    //accounts table
    return knex.schema
        .createTable('invites', function (table) {
            //Identity fields
            table.increments('id').primary();
            table
                .bigInteger("workspace_id")
                .notNullable()
                .references("workspaces.id")
                .onDelete("CASCADE");
            table.string('name');
            table.string('email').notNullable();
            table.string('token').notNullable().unique();
            table.boolean('used').defaultTo(false).notNullable();
            table.timestamp('expires_at').notNullable();
            table.bigInteger('user_id').references('users.id').onDelete('CASCADE');
            table.json('rules');
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
            table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

            table.unique(['email', 'token']);
        })

};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('invites');

};

exports.config = {
    transaction: true
};