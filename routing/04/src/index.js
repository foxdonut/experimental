import ReactDOM from "react-dom"
import flyd from "flyd"
import { createApp } from "./app"
import { HomePage } from "./constants"

export const update = flyd.stream()
export const models = flyd.scan((model, func) => func(model), { pageId: HomePage }, update)
export const App = createApp(update)

export const element = document.getElementById("app")
models.map(model => { ReactDOM.render(App.view(model), element) })

models.map(model => {
  const url = model.url
  if (url && document.location.hash !== url) {
    window.history.pushState({}, "", url)
  }
})

const onUrlChange = () => App.navigator.handleUrl(document.location.hash.substring(1))
window.onpopstate = onUrlChange

// Handle initial url
onUrlChange()
