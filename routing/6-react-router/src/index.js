import ReactDOM from "react-dom"
import flyd from "flyd"
import { m } from "./utils"
import { createApp } from "./app"
import { HomePage } from "./constants"

export const update = flyd.stream()
export const App = createApp(update)
export const models = flyd.scan((model, func) => func(model),
  { pageId: HomePage }, update)

export const element = document.getElementById("app")
models.map(model => { ReactDOM.render(m(App, { model }), element) })