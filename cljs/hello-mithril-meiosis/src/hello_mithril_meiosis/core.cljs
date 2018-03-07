(ns hello-mithril-meiosis.core
  ;(:require ["mithril" :as m] ["mithril-stream"]))
  (:require ["mithril" :as m] ["flyd" :as flyd]))

(defn create-view [update-stream]
  (let [increase (fn [amount] (fn [event] (update-stream amount)))]
    (fn [model] (m "div"
      (m "div" (str "Value: " model))
      (m "button" { "onclick" (increase  1) } "+1")
      (m "button" { "onclick" (increase -1) } "-1")
    ))))

(def update-stream (.stream flyd))
(def view (create-view update-stream))

(def models (.scan flyd (fn [model value] (+ model value)) 0 update-stream))

(.map models (fn [model] (.render m js/app (view model))))

