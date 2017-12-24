"use strict";

const Recipes = require("../recipes");
const render = require("../domvm");
const Home = require("../domvm/home");
const Detail = require("../domvm/detail");

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
    render(Home({ recipes: recipes }), (err, doc) => {
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
      render(Detail({ recipe: recipe }), (err, doc) => {
        if (err) {
          throw err;
        }
        return reply(doc);
      });
    }
    else {
      return reply("Recipe not found").code(404);
    }
  })
};
