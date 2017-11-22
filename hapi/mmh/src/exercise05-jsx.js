/** global __dirname **/
const Hapi = require("hapi");
const path = require("path");
//const domvm = require("domvm");
const domvm = require("domvm/dist/server/domvm.server");

const render = require("../build/generated-domvm").render;

const createJsx = function(h) {
  return function(type, props) {
    const args = [type, props];
    const rest = [];
    for (var i = 2; i < arguments.length; i++) {
      rest.push(arguments[i])
    }
    args.push(rest);
    return h.apply(null, args);
  };
};

global.jsx = createJsx(domvm.defineElement);

const View = () => (vm, data) => render(data);
/*
const el = domvm.defineElement;
const View = () => (vm, data) =>
  el("html", [
    el("head", [
      el("title", data.name)
    ]),
    el("body", "Hello, " + data.name)
  ]);
*/

const html = data => domvm.createView(View, data).html();

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
      reply(html(request.query));
    }
  }
]);

server.start(function(err) {
  if (err) {
    throw err;
  }
  console.log("Server running on", server.info.uri);
});

