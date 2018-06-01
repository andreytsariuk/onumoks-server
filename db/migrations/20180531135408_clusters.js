"use strict";

exports.up = function (knex) {
  return knex.schema
    .createTable("clusters", function (table) {
      table.increments("id").primary();
      table
        .string("name");
      table
        .string("color");
      table
        .string("description");

      table
        .double("difference")
        .notNullable();

      

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
    .dropTable("clusters")

};
