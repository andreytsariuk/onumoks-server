'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTable('articles', function (table) {
            table
                .increments('id')
                .primary();
            table
                .string('mime_type');
            table
                .string('name')
                .notNullable();
                table
                .string('s3_key');
            table
                .bigInteger("lector_id")
                .notNullable()
                .references("lectors.id")
                .onDelete("CASCADE");
            table
                .bigInteger("cluster_id")
                .references("clusters.id");
            table
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();

            table
                .unique(['name', 'mime_type', 'lector_id']);
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('articles')
};