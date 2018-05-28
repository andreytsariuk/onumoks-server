"use strict";

exports.up = function (knex) {
    return knex.schema
        .createTable("groups", function (table) {
            table.increments("id").primary();
            table
                .string("title")
                .notNullable()
            table
                .string("description")
                .notNullable()

            table
                .bigInteger("course_id")
                .notNullable()
                .references("courses.id")
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
        })
        .createTable("groups_students", function (table) {
            table.increments("id").primary();
            table
                .bigInteger("group_id")
                .notNullable()
                .references("groups.id")
                .onDelete("CASCADE");
            table
                .bigInteger("student_id")
                .notNullable()
                .references("students.id")
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
        .dropTable("groups_students")
        .dropTable("groups")


};

