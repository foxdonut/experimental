/** global __dirname **/
const Hapi = require("hapi");
const Inert = require("inert");
const path = require("path");

const server = new Hapi.Server();

server.register(Inert, function(err) {
  if (err) {
    throw err;
  }
});

server.connection({
  host: "localhost",
  port: Number(process.argv[2]) || 8400
});

server.route([
  {
    path: "/foo/bar/baz/{filename}",
    method: "GET",
    handler: {
      directory: {
        path: path.join(__dirname, "public")
      }
    }
  }
]);

server.start(function(err) {
  if (err) {
    throw err;
  }
  console.log("Server running on", server.info.uri);
});

