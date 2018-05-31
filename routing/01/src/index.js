import ReactDOM from "react-dom"
import flyd from "flyd"
import { createApp } from "./app.jsx"
import { HomePage } from "./constants"

const update = flyd.stream()
const models = flyd.scan((model, func) => func(model), { pageId: HomePage }, update)
const App = createApp(update)
//const router = App.router

const element = document.getElementById("app")
models.map(model => { ReactDOM.render(App.view(model), element) })

/*
models.map(model => {
  const route = router.generate(model.pageId, model.params)
  if (document.location.hash !== route) {
    window.history.pushState({}, "", route)
  }
})
*/
