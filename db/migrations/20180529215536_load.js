"use strict";

exports.up = function (knex) {
    return knex.schema
        .createTable("loads", function (table) {
            table.increments("id").primary();
            table
                .string("title")
                .notNullable()
                .unique();
            table
                .string("description");
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
        .createTable("load_items", function (table) {
            table.increments("id").primary();
            table
                .bigInteger("load_id")
                .notNullable()
                .references("loads.id")
                .onDelete("CASCADE");
            table
                .bigInteger("hours_count")
                .notNullable();
            table
                .bigInteger("lector_id")
                .notNullable()
                .references("lectors.id")
                .onDelete("CASCADE");
            table
                .bigInteger("subject_id")
                .notNullable()
                .references("subjects.id")
                .onDelete("CASCADE");
            table
                .bigInteger("lesson_type_id")
                .notNullable()
                .references("lesson_types.id")
                .onDelete("CASCADE");
            table
                .bigInteger("thread_id")
                .references("threads.id")
                .onDelete("CASCADE");
            table
                .bigInteger("group_id")
                .references("groups.id")
                .onDelete("CASCADE");
            table
                .bigInteger("course_id")
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

            table.unique(["lector_id", "subject_id", "lesson_type_id", 'thread_id', 'group_id', 'course_id']);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable("load_items")
        .dropTable("loads")


};
