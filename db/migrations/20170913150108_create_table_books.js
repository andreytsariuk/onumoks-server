
exports.up = function (knex, Promise) {

    return knex
        .schema
        .createTable('books', function (column) {
            column
                .increments('id')
                .primary();
            column
                .string('title')
                .notNullable();
            column
                .string('author');
            column
                .string('description');
            column
                .bigInteger('user_id');
            column
                .string('image');
            column
                .timestamp('created_at')
                .defaultTo(knex.fn.now())
                .notNullable();
            column
                .timestamp('updated_at')
                .defaultTo(knex.fn.now())
                .notNullable();
        })
        .createTable('subjects_books', function (table) {
            table.increments('id').primary();
            table.bigInteger('book_id').references('books.id').notNullable();
            table.bigInteger('subject_id').references('subjects.id').notNullable();
        })
};

exports.down = function (knex, Promise) {
    return knex
        .schema
        .dropTable('books')
        .dropTable('subjects_books');
};
