(defproject hello-mithril-meiosis "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [
    [org.clojure/clojure "1.8.0"]
    [org.clojure/clojurescript "1.10.64"]
  ]

  :plugins [
    [lein-cljsbuild "1.1.7"]
  ]

  :cljsbuild {
    :builds {
      :dev {
        :source-paths ["src"]
        :compiler {
          :main "hello-mithril-meiosis.core"
          :output-to "build/bundle-dev.js"
          :optimizations :none
          :pretty-print true
          :install-deps true
          :npm-deps {
            :mithril "1.1.6"
            :mithril-stream "1.1.0"
            :flyd "0.2.6"
          }
        }
      }
      :standalone {
        :source-paths ["src"]
        :compiler {
          :main "hello-mithril-meiosis.core"
          :output-to "build/bundle-standalone.js"
          :optimizations :simple
          :pretty-print false
          :install-deps true
          :npm-deps {
            :mithril "1.1.6"
            :mithril-stream "1.1.0"
            :flyd "0.2.6"
          }
        }
      }
      :prod {
        :source-paths ["src"]
        :compiler {
          :main "hello-mithril-meiosis.core"
          :output-to "build/bundle-prod.js"
          :optimizations :advanced
          :pretty-print false
          :install-deps true
          :npm-deps {
            :mithril "1.1.6"
            :mithril-stream "1.1.0"
            :flyd "0.2.6"
          }
        }
      }
    }
  }

  :clean-targets ^{:protect false} [
    "build"
    :target-path
  ]
)
