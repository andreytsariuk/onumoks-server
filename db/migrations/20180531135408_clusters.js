"use strict";

exports.up = function (knex) {
  return knex.schema
    .createTable("clusters", function (table) {
      table.increments("id").primary();
      table
        .string("name");
      table
        .string("description");
      table
        .integer("min_agree")
        .notNullable();

      table
        .bigInteger("centroid")
        .notNullable()
        .references("documents.id")
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
    .dropTable("lesson_types")

};
