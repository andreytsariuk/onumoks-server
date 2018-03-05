"use strict";

exports.up = function (knex) {
  return knex.schema
    .createTable("workspaces", function (table) {
      table.increments("id").primary();
      table
        .string("name")
        .notNullable()
        .unique();
      table
        .timestamp("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updated_at")
        .defaultTo(knex.fn.now())
        .notNullable();
    })
    .createTable("users", function (table) {
      table.increments("id").primary();
      table
        .string("email")
        .notNullable()
        .unique();
      table
        .string("password");
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
    .createTable("roles", function (table) {
      table.increments("id").primary();
      table
        .bigInteger("user_id")
        .notNullable()
        .references("users.id")
        .onDelete("CASCADE");

      table.bigInteger("role_id").notNullable();
      table.string("role_type").notNullable();

      table.unique(["user_id", "role_id", "role_type"]);
      table
        .timestamp("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updated_at")
        .defaultTo(knex.fn.now())
        .notNullable();
    })

    .createTable("students", function (table) {
      table.increments("id").primary();
    })
    .createTable("lectors", function (table) {
      table.increments("id").primary();
    })
    .createTable("admins", function (table) {
      table.increments("id").primary();
    })
    .createTable("profiles", function (table) {
      table.increments("id").primary();
      table
        .bigInteger("user_id")
        .notNullable()
        .references("users.id")
        .onDelete("CASCADE")
        .unique();
      table.string("gender");
      table.string("fname");
      table.string("lname");
      table.string("personal_phone");
      table.string("work_phone");
      table.string("personal_email");
      table.string("work_email");
      table
        .timestamp("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updated_at")
        .defaultTo(knex.fn.now())
        .notNullable();
    })
    .createTable("settings", function (table) {
      table.increments("id").primary();
      table
        .bigInteger("user_id")
        .notNullable()
        .references("users.id")
        .onDelete("CASCADE");
      table
        .string("language")
        .notNullable()
        .defaultTo("eng");
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
    .dropTable("workspaces")
    .dropTable("roles")
    .dropTable("students")
    .dropTable("lectors")
    .dropTable("admins")
    .dropTable("profiles")
    .dropTable("settings")
    .dropTable("users");
};
