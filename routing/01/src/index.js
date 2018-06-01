import ReactDOM from "react-dom"
import flyd from "flyd"
import { createApp } from "./app.jsx"
import { HomePage } from "./constants"

export const update = flyd.stream()
export const models = flyd.scan((model, func) => func(model), { pageId: HomePage }, update)
export const App = createApp(update)

export const element = document.getElementById("app")
models.map(model => { ReactDOM.render(App.view(model), element) })
