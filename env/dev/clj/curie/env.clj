(ns curie.env
  (:require
    [selmer.parser :as parser]
    [clojure.tools.logging :as log]
    [curie.dev-middleware :refer [wrap-dev]]))

(def defaults
  {:init
   (fn []
     (parser/cache-off!)
     (log/info "\n-=[curie started successfully using the development profile]=-"))
   :stop
   (fn []
     (log/info "\n-=[curie has shut down successfully]=-"))
   :middleware wrap-dev})
