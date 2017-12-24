"use strict";

const Recipes = require("../recipes");
const render = require("../domvm");
const Home = require("../domvm/home");
const Detail = require("../domvm/detail");
const Async = require("crocks/Async");

exports.publicDir = {
  directory: {
    path: "public"
  }
};

const throwFn = err => { throw err };

/*
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
*/

exports.home = function(request, reply) {
  Recipes.findAll(this.db, request.query).chain(recipes =>
    render(Home({ recipes: recipes }))
  ).fork(throwFn, reply);
};

/*
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
*/

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
