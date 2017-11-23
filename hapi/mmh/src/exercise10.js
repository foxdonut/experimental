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
    path: "/login",
    method: "POST",
    handler: function(request, reply) {
      reply("login successful");
    },
    config: {
      validate: {
        payload: Joi.object({
          isGuest: Joi.boolean().required(),
          username: Joi.string().when("isGuest", {
            is: false,
            then: Joi.required()
          }),
          accessToken: Joi.string().alphanum(),
          password: Joi.string().alphanum()
        })
          .options({ allowUnknown: true })
          .xor("accessToken", "password")
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
