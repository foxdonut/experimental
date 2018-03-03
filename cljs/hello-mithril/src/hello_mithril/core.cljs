(ns hello-mithril.core
  (:require [mithril]))

(js/m.render js/document.body (js/m "div" "Hello from ClojureScript Mithril"))

(enable-console-print!)

(println "Hello ClojureScript Mithril")
