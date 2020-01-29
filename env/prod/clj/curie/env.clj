(ns curie.env
  (:require [clojure.tools.logging :as log]))

(def defaults
  {:init
   (fn []
     (log/info "\n-=[curie started successfully]=-"))
   :stop
   (fn []
     (log/info "\n-=[curie has shut down successfully]=-"))
   :middleware identity})
