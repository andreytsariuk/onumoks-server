"use strict";

exports.up = function (knex) {
    return knex.schema
        .createTable("positions", function (table) {
            table.increments("id").primary();
            table
                .string("name")
                .notNullable();
            table
                .string("title")
                .notNullable();
            table
                .string("description")
                .notNullable();
            table
                .integer("hours_count")
                .defaultTo(0)
            table
                .bigInteger("workspace_id")
                .notNullable()
                .references("workspaces.id")
                .onDelete("CASCADE");

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

exports.down = function (knex) {
    return knex.schema
        .dropTable("positions")

};
