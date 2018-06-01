"use strict";

exports.up = function (knex) {
  return knex.schema
    .createTable("knowledges", function (table) {
      table.increments("id").primary();
      table
        .string("name")
        .notNullable()
      table
        .timestamp("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updated_at")
        .defaultTo(knex.fn.now())
        .notNullable();
    })
    .createTable("keywords", function (table) {
      table.increments("id").primary();
      table
        .string("name")
        .notNullable();
      table
        .boolean("hidden")
        .defaultTo(false)
        .notNullable()
      table
        .timestamp("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updated_at")
        .defaultTo(knex.fn.now())
        .notNullable();
    })
    .createTable("lectors_knowledges", function (table) {
      table.increments("id").primary();
      table
        .bigInteger("lector_id")
        .notNullable()
        .references("lectors.id")
        .onDelete("CASCADE");
      table
        .bigInteger("knowledge_id")
        .notNullable()
        .references("knowledges.id")
        .onDelete("CASCADE");
      table
        .timestamp("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updated_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table.unique(["lector_id", "knowledge_id"]);

    })
    .createTable("keywords_knowleges", function (table) {
      table.increments("id").primary();
      table
        .bigInteger("keyword_id")
        .notNullable()
        .references("keywords.id")
        .onDelete("CASCADE");
      table
        .bigInteger("knowledge_id")
        .notNullable()
        .references("knowledges.id")
        .onDelete("CASCADE");
      table
        .timestamp("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updated_at")
        .defaultTo(knex.fn.now())
        .notNullable();

      table.unique(["keyword_id", "knowledge_id"]);
    })
    .createTable("documents_keywords", function (table) {
      table.increments("id").primary();
      table
        .bigInteger("document_id")
        .notNullable()
        .references("documents.id")
        .onDelete("CASCADE");
      table
        .bigInteger("keyword_id")
        .notNullable()
        .references("keywords.id")
        .onDelete("CASCADE");
      table
        .timestamp("created_at")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updated_at")
        .defaultTo(knex.fn.now())
        .notNullable();

      table.unique(["document_id", "keyword_id"]);

    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("documents_keywords")
    .dropTable("keywords_knowleges")
    .dropTable("lectors_knowledges")
    .dropTable("keywords")
    .dropTable("knowledges");

};

