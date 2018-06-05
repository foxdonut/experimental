import * as Main from "./index"
import { trace } from "meiosis"
import meiosisTracer from "meiosis-tracer"

const tracerElement = document.createElement("div")
tracerElement.id = "tracer"
tracerElement.style = "position: absolute; top: 0; right: 0"
Main.element.parentNode.insertBefore(tracerElement, Main.element.nextSibling)

trace({ update: Main.update, dataStreams: [ Main.models ]})
meiosisTracer({ selector: "#tracer" })
/*
const navigator = Main.App.navigator
Main.models.map(model => {
  const url = navigator.getLink(model.pageId, model.params)
  if (document.location.hash !== url) {
    window.history.pushState({}, "", url)
  }
})
*/
