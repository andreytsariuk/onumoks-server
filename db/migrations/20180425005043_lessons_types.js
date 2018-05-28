"use strict";

exports.up = function (knex) {
    return knex.schema
        .createTable("lesson_types", function (table) {
            table.increments("id").primary();
            table
                .string("name")
                .notNullable()
            table
                .string("description")
                .notNullable();
            table
                .integer("hours_count");


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
        .dropTable("lesson_types")

};
