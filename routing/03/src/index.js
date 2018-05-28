import ReactDOM from "react-dom"
import flyd from "flyd"
import { createApp } from "./app.jsx"
import { ListPage } from "./list.jsx"

const update = flyd.stream()
const models = flyd.scan((model, func) => func(model), { pageId: ListPage }, update)
const App = createApp(update)
const element = document.getElementById("app")
models.map(model => { ReactDOM.render(App.view(model), element) })
