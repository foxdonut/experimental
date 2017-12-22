"use strict";

const Recipes = require("../recipes");
const View = require("../domvm");

exports.publicDir = {
  directory: {
    path: "public"
  }
};

exports.home = function(request, reply) {
  Recipes.findAll(this.db, request.query, (err, recipes) => {
    if (err) {
      throw err;
    }
    View.home({ recipes: recipes }, (err, doc) => {
      if (err) {
        throw err;
      }
      reply(doc);
    });
  });
};

exports.detail = function(request, reply) {
  Recipes.findOne(this.db, request.params.id, (err, recipe) => {
    if (err) {
      throw err;
    }
    if (recipe) {
      View.detail({ recipe: recipe }, (err, doc) => {
        if (err) {
          throw err;
        }
        reply(doc);
      });
    }
    return reply("Recipe not found").code(404);
  })
};
