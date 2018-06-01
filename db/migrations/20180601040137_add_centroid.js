const Promise = require('bluebird');


exports.up = function (knex, Promise) {
    //Users Table
    return knex.schema.table('clusters', function (table) {
        table
        .bigInteger("centroid")
        .notNullable()
        .references("articles.id");

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('clusters', function (table) {
        table.dropColumn('centroid');
       

    })
};

exports.config = {
    transaction: true
};