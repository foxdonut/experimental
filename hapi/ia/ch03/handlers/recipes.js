"use strict";

const Recipes = require("../recipes");

exports.findAll = function(request, reply) {
  Recipes.findAll(this.db, request.query, (err, rows) => {
    if (err) {
      throw err;
    }
    return reply(rows);
  });
};

exports.findOne = function(request, reply) {
  Recipes.findOne(this.db, request.params.id, (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      return reply(row);
    }
    return reply("Recipe not found").code(404);
  });
};

exports.create = function(request, reply) {
  Recipes.create(this.db, request.payload, err => {
    if (err) {
      throw err;
    }
    reply({ status: "OK" });
  });
};

exports.star = function(request, reply) {
  Recipes.star(this.db, request.params.id, (err, row) => {
    if (err) {
      throw err;
    }

    if (row) {
      return reply({ status: "OK" });
    }
    else {
      return reply("Recipe not found").code(404);
    }
  });
};
