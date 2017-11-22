/** global __dirname **/
const Hapi = require("hapi");
const Inert = require("inert");
const path = require("path");

//const server = new Hapi.Server();

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: __dirname
      }
    }
  }
});

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
    path: "/",
    method: "GET",
    handler: {
      file: path.join(__dirname, "exercise03.html")
    }
  }
]);

server.start(function(err) {
  if (err) {
    throw err;
  }
  console.log("Server running on", server.info.uri);
});

