const fs = require("fs");
const Path = require("path");
const domvm = require("domvm");

module.exports = function(view, cb) {
  fs.readFile(Path.join(__dirname, "../public/index.html"), "utf8", (err, data) => {
    if (err) {
      cb(err, null);
    }
    else {
      const View = () => () => view;
      const html = () => domvm.createView(View).html();
      const document = data.replace(/\r?\n */g, "").replace(/<body>.*<\/body>/, html());
      cb(null, document);
    }
  });
};
