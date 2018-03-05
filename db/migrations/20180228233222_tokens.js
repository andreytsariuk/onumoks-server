const Promise = require('bluebird');

exports.up = function (knex, Promise) {
    //accounts table
    return knex.schema
        .createTable('tokens', function (table) {
            //Identity fields
            table.increments('id').primary();
            table
                .bigInteger("workspace_id")
                .notNullable()
                .references("workspaces.id")
                .onDelete("CASCADE");

            table.bigInteger('user_id').references('users.id').onDelete('CASCADE');
            table.string('token').notNullable().unique();
            table.string('type').notNullable();
            table.boolean('used').defaultTo(false).notNullable();
            table.timestamp('expires_at').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
            table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

            table.unique(['user_id', 'token', 'expires_at']);
        })

};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('tokens')

};

exports.config = {
    transaction: true
};