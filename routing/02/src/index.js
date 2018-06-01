import m from "mithril"
import stream from "mithril-stream"
import { P } from "patchinko"
import { createApp } from "./app"
import { HomePage } from "./constants"

export const update = stream()
export const models = stream.scan(P, { pageId: HomePage }, update)
export const App = createApp(update)
const navigator = App.navigator

export const element = document.getElementById("app")
m.route(element, "/", Object.keys(navigator.routes).reduce((result, route) => {
  result[route] = {
    onmatch: params => navigator.navigateTo(navigator.routes[route], params),
    render: () => m(App, { model: models() })
  }
  return result
}, {}))
