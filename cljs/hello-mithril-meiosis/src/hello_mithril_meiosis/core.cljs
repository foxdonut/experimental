(ns hello-mithril-meiosis.core
  (:require ["mithril" :as m] ["mithril-stream" :as stream]))

(defn create-view [update-stream]
  (let [increase (fn [amount] (fn [event] (update-stream amount)))]
    (fn [model] (m "div"
      (m "div" (str "Counter: " model))
      (m "button" (js-obj "onclick" (increase  1)) "+1")
      (m "button" (js-obj "onclick" (increase -1)) "-1")
    ))))

(def update-stream (stream))
(def view (create-view update-stream))

(def models (.scan stream (fn [model value] (+ model value)) 0 update-stream))

(.map models (fn [model] (.render m js/app (view model))))

