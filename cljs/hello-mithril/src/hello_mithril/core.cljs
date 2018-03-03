(ns hello-mithril.core
  (:require [mithril]))

(def m js/m)
(m.render js/app (m "div" "Hello Mithril with ClojureScript"))

;(js/m.render js/document.body (js/m "div" "Hello from ClojureScript Mithril"))

(enable-console-print!)

(println "Hello Mithril with ClojureScript")
