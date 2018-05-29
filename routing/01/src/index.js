import ReactDOM from "react-dom"
import flyd from "flyd"
import Navigo from "navigo"
import { createApp } from "./app.jsx"
import { FormPage, ListPage } from "./constants"

const update = flyd.stream()
const models = flyd.scan((model, func) => func(model), { pageId: ListPage }, update)
const App = createApp(update)

const navigator = App.navigator
const router = new Navigo(null, true)
router.on({
  "/list": { as: ListPage, handler: () => navigator.navigate(ListPage) },
  "/form/:item": { as: FormPage, handler: params => navigator.navigate(FormPage, params) }
})

const element = document.getElementById("app")
models.map(model => { ReactDOM.render(App.view(model), element) })

models.map(model => {
  const route = router.generate(model.pageId, model)
  if (document.location.hash !== route) {
    window.history.pushState({}, "", route)
  }
})
