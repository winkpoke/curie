(ns curie.doo-runner
  (:require [doo.runner :refer-macros [doo-tests]]
            [curie.core-test]))

(doo-tests 'curie.core-test)

