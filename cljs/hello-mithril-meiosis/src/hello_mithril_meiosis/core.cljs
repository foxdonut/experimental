(ns hello-mithril-meiosis.core
  ;(:require [mithril] [mithril-stream]]))
  (:require [mithril] [flyd :refer [scan stream]]))

(def m js/m)

(defn create-view [update-stream]
  (let [increase (fn [amount] (fn [event] (update-stream amount)))]
    (fn [model] (m "div"
      (m "div" (str "Value: " model))
      (m "button" { "onclick" (increase  1) } "+1")
      (m "button" { "onclick" (increase -1) } "-1")
    ))))

(def model 0)
;(def update-stream (m.stream))
(def update-stream (stream))
(def view (create-view update-stream))

;(def models (js/window.m.stream.scan (fn [model value] (+ model value)) model update-stream))
(def models (scan (fn [model value] (+ model value)) model update-stream))

(.map models (fn [model] (m.render js/app (view model))))
