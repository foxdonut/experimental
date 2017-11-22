const Hapi = require("hapi");

const server = new Hapi.Server();

server.connection({
  host: "localhost",
  port: Number(process.argv[2]) || 8400
});

server.route([
  {
    path: "/",
    method: "GET",
    handler: function(request, reply) {
      reply("Hello hapi");
    }
  },
  {
    path: "/{name}",
    method: "GET",
    handler: function(request, reply) {
      reply("Hello " + request.params.name);
    }
  }
]);

server.start(function(err) {
  if (err) {
    throw err;
  }
  console.log("Server running on", server.info.uri);
});

