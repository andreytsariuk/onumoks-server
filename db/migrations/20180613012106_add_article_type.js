const Promise = require('bluebird');


exports.up = function (knex, Promise) {
    //Users Table
    return knex.schema.table('articles', function (table) {
        table.integer("aricle_weight");
        table
            .bigInteger("subject_id")
            .references("subjects.id")
            .onDelete("CASCADE");
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('articles', function (table) {
        table.dropColumn('aricle_weight');
        table.dropColumn('subject_id');
    })
};

exports.config = {
    transaction: true
};