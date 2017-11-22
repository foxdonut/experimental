/** global __dirname **/
const Hapi = require("hapi");
const Vision = require("vision");
const path = require("path");
const handlebars = require("handlebars");

const server = new Hapi.Server();

server.register(Vision, function(err) {
  if (err) {
    throw err;
  }
});

server.views({
  path: path.join(__dirname, "templates"),
  engines: {
    html: handlebars
  }
});

server.connection({
  host: "localhost",
  port: Number(process.argv[2]) || 8400
});

server.route([
  {
    path: "/",
    method: "GET",
    handler: {
      view: "index.html"
    }
  }
]);

server.start(function(err) {
  if (err) {
    throw err;
  }
  console.log("Server running on", server.info.uri);
});

