const fs = require("fs");
const Path = require("path");
const domvm = require("domvm");
const Async = require("crocks/Async");

/*
module.exports = function(view, cb) {
  fs.readFile(Path.join(__dirname, "../public/index.html"), "utf8", (err, data) => {
    if (err) {
      cb(err, null);
    }
    else {
      const View = () => () => view;
      const html = () => domvm.createView(View).html();
*/
//    const document = data.replace(/\r?\n */g, "").replace(/<body>.*<\/body>/, html());
/*
      cb(null, document);
    }
  });
};
*/

module.exports = view =>
  Async.fromNode(fs.readFile, fs)(Path.join(__dirname, "../public/index.html"), "utf8")
    .map(data => {
      const View = () => () => view;
      const html = () => domvm.createView(View).html();
      return data.replace(/\r?\n */g, "").replace(/<body>.*<\/body>/, html());
    });
