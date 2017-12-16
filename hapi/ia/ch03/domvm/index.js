const fs = require("fs");
const Path = require("path");
const domvm = require("domvm");

const main = require("./main");

const View = () => (vm, model) => main(model);
const html = model => domvm.createView(View, model).html();

module.exports = function(model, cb) {
  fs.readFile(Path.join(__dirname, "../public/index.html"), "utf8", (err, data) => {
    if (err) {
      cb(err, null);
    }
    else {
      const document = data.replace(/\r?\n */g, "").replace(/<body>.*<\/body>/, html(model));
      cb(null, document);
    }
  });
};
