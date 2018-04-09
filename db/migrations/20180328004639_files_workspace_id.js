const Promise = require('bluebird');


exports.up = function (knex, Promise) {
    //Users Table
    return knex.schema.table('files', function (table) {
        table.bigInteger('workspace_id').references('workspaces.id').onDelete('CASCADE');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('files', function (table) {
        table.dropColumn('workspace_id');
    })
};

exports.config = {
    transaction: true
};