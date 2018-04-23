"use strict";

exports.up = function (knex) {
    return knex.schema
        .createTable("courses", function (table) {
            table.increments("id").primary();
            table
                .string("title")
                .notNullable()
            table
                .string("description")
                .notNullable()
            table
                .integer("level")
                .notNullable()
            table
                .bigInteger("specialty_id")
                .notNullable()
                .references("specialties.id")
                .onDelete("CASCADE");
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
        .dropTable("courses")

};
