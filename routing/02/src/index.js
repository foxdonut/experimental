import m from "mithril"
import stream from "mithril-stream"
import { P } from "patchinko"
import { createApp } from "./app"
import { HomePage } from "./constants"

const update = stream()
const models = stream.scan(P, { pageId: HomePage }, update)
const App = createApp(update)
const navigator = App.navigator

m.route(document.getElementById("app"), "/", Object.keys(navigator.routes).reduce((result, route) => {
  result[route] = {
    onmatch: params => navigator.navigate(navigator.routes[route], params),
    render: () => m(App, { model: models() })
  }
  return result
}, {}))

/*
// only for using tracer in development
models.map(model => {
  const route = "#!" + navigator.getPath(model.pageId, model.params)
  if (document.location.hash !== route) {
    window.history.pushState({}, "", route)
  }
})
*/
