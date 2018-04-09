"use strict";

exports.up = function (knex) {
    return knex.schema
        .createTable("specialties", function (table) {
            table.increments("id").primary();
            table
                .string("name")
                .notNullable()
                .unique();
            table
                .string("title")
                .notNullable()
            table
                .string("code")
                .notNullable()
                .unique();

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
        .dropTable("specialties")

};
