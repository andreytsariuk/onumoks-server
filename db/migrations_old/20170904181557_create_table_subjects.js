
exports.up = function (knex, Promise) {

    return knex
        .schema
        .createTable('subjects', function (column) {
            column
                .increments('id')
                .primary();
            column
                .string('title')
                .notNullable();
            column
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            column
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();
        })
};

exports.down = function (knex, Promise) {
    return knex
        .schema
        .dropTable('subjects');
};
