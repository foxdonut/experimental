const domvm = require("domvm");
const el = domvm.defineElement;

module.exports = model =>
  el("body", [
    el("header", [
      el("a#logo", { href: "/" }, [ el("img", { src: "/images/logo.png"}) ]),
      el("a.header-button", { href: "/login" }, "Login")
    ]),
    el("div.recipe-detail", [
      el("h3.recipe-summary-name", model.recipe.name + " " + model.recipe.cuisine),
      el("span.stars", model.recipe.stars + " ★"),
      el("p.recipe-info", "Serves: " + model.recipe.serves + " | Prep: " +
        model.recipe.prep_time + " | Cooking: " + model.recipe.cooking_time),
      el("h4", "Ingredients"),
      el("p", model.recipe.ingredients),
      el("h4", "Directions"),
      el("p", model.recipe.directions),
      el("a.star-button", { href: "/recipes/" + model.recipe.id + "/star" },
        "★ Star this recipe ★")
    ]),
    el("footer", {".innerHTML": "<p>&copy; 2017 DinDin</p>" })
  ]);
