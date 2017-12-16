"use strict";

const Pages = require("./handlers/pages");
const Recipes = require("./handlers/recipes");

module.exports =
  [ { method: "GET"
    , path: "/api/recipes"
    , handler: Recipes.findAll
    }
  , { method: "GET"
    , path: "/api/recipes/{id}"
    , handler: Recipes.findOne
    }
  , { method: "POST"
    , path: "/api/recipes"
    , config: { auth: "api" }
    , handler: Recipes.create
    }
  , { method: "POST"
    , path: "/api/recipes/{id}/star"
    , config: { auth: "api" }
    , handler: Recipes.star
    }
  , { method: "GET"
    , path: "/"
    , handler: Pages.home
    }
  , { method: "GET"
    , path: "/{filename*}"
    , handler: Pages.publicDir
    }
  ];

