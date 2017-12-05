"use strict";

const Recipes = require("./handlers/recipes");
const Dx = require("./handlers/dx");

module.exports =
  [ { method: "GET"
    , path: "/api/recipes"
    , handler: Recipes.findAll
    }
  , { method: "GET"
    , path: "/api/recipes/{id}"
    , handler: Recipes.findOne
    }
  , { method: "GET"
    , path: "/api/dx"
    , handler: Dx.findSome
    }
  ];

