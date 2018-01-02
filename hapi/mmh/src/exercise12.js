/** global __dirname **/
const Hapi = require("hapi");
const Boom = require("boom");
const path = require("path");

const server = new Hapi.Server();

server.connection({
  host: "localhost",
  port: Number(process.argv[2]) || 8400
});

server.state("session", {
  ttl: 1000 * 60 * 60 * 2,
  path: "/",
  encoding: "base64json",
  domain: "localhost",
  isSecure: false
});

server.route([
  {
    path: "/set-cookie",
    method: "GET",
    config: {
      state: {
        parse: true,
        failAction: "log"
      }
    },
    handler: function(request, reply) {
      return reply("set-cookie successful").state("session", { user: "makemehapi" });
    }
  },
  {
    path: "/get-cookie",
    method: "GET",
    handler: function(request, reply) {
      var session = request.state.session;

      if (!session) {
        reply(Boom.unauthorized("Missing authentication"));
      } else {
        reply("OK");
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
