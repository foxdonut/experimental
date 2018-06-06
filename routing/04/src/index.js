import ReactDOM from "react-dom"
import flyd from "flyd"
import { createApp } from "./app"
import { HomePage } from "./constants"

export const update = flyd.stream()
export const App = createApp(update)
export const models = flyd.scan((model, func) => func(model), { pageId: HomePage }, update)

export const element = document.getElementById("app")
models.map(model => { ReactDOM.render(App.view(model), element) })

// The url is part of the view. Display it in the browser's location bar.
models.map(model => {
  const url = model.url
  if (url && document.location.hash !== url) {
    window.history.pushState({}, "", url)
  }
})

// Handle the browser's back and forward buttons, and when a url is typed in.
const handleUrlChange = () => App.navigator.handleUrl(document.location.hash.substring(1))
window.onpopstate = handleUrlChange

// Handle the initial url.
handleUrlChange()
