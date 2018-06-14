import m from "mithril"
import stream from "mithril-stream"
import { P } from "patchinko"
import { createApp } from "./app"
import { prefix, HomePage } from "./constants"

export const update = stream()
export const App = createApp(update)
export const models = stream.scan(P, { pageId: HomePage }, update)
const navigator = App.navigator

export const element = document.getElementById("app")
m.route.prefix(prefix)
m.route(element, "/", Object.keys(navigator.routes).reduce((result, route) => {
  result[route] = {
    onmatch: (params, url) => navigator.onnavigate(navigator.routes[route], params, url),
    render: () => m(App, { model: models() })
  }
  return result
}, {}))
