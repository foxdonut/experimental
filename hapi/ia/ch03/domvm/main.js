const domvm = require("domvm");
const el = domvm.defineElement;

module.exports = model =>
  el("body", [
    el("header", [
      el("a#logo", { href: "/" }, [ el("img", { src: "/images/logo.png"}) ]),
      el("a.header-button", { href: "/login" }, "Login")
    ]),
    model.recipes.map(recipe =>
      el("a.recipe-summary", { href: "/recipes/" + recipe.id }, [
        el("h3.recipe-summary-name", recipe.name + " " + recipe.cuisine),
        el("span.stars", recipe.stars + " ★"),
        el("p.recipe-info", "Serves: " + recipe.serves + " | Prep: " + recipe.prep_time +
          " | Cooking: " + recipe.cooking_time)
      ])
    ),
    el("footer", {".innerHTML": "<p>&copy; 2017 DinDin</p>" })
  ]);
