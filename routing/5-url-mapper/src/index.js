import ReactDOM from "react-dom"
import flyd from "flyd"
import { createApp } from "./app"
import { HomePage } from "./constants"

export const update = flyd.stream()
export const App = createApp(update)
export const models = flyd.scan((model, func) => func(model), { pageId: HomePage }, update)

export const element = document.getElementById("app")
models.map(model => { ReactDOM.render(App.view(model), element) })

// Handle url changes.
const handleUrlChange = () => App.navigator.handleUrl(document.location.hash.substring(1))
window.onpopstate = handleUrlChange

// Handle the initial url.
handleUrlChange()
