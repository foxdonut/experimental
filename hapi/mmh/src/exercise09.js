/** global __dirname **/
const Hapi = require("hapi");
const Joi = require("joi");
const path = require("path");

const server = new Hapi.Server();

server.connection({
  host: "localhost",
  port: Number(process.argv[2]) || 8400
});

server.route([
  {
    path: "/chickens/{breed}",
    method: "GET",
    handler: function(request, reply) {
      reply("Hello chickens: " + request.params.breed);
    },
    config: {
      validate: {
        params: {
          breed: Joi.string().min(3).required()
        }
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

