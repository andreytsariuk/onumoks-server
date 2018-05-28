"use strict";

exports.up = function (knex) {
    return knex.schema
        .createTable("threads", function (table) {
            table.increments("id").primary();
            table
                .string("title")
                .notNullable()
            table
                .string("description")
                .notNullable()
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
        .createTable("threads_groups", function (table) {
            table.increments("id").primary();
            table
                .bigInteger("thread_id")
                .notNullable()
                .references("threads.id")
                .onDelete("CASCADE");
            table
                .bigInteger("group_id")
                .notNullable()
                .references("groups.id")
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
        .createTable("threads_courses", function (table) {
            table.increments("id").primary();
            table
                .bigInteger("thread_id")
                .notNullable()
                .references("threads.id")
                .onDelete("CASCADE");
            table
                .bigInteger("course_id")
                .notNullable()
                .references("courses.id")
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
        .createTable("threads_students", function (table) {
            table.increments("id").primary();
            table
                .bigInteger("thread_id")
                .notNullable()
                .references("threads.id")
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
        .dropTable("threads_students")
        .dropTable("threads_courses")
        .dropTable("threads_groups")
        .dropTable("threads");

};

