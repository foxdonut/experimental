import Navigo from "navigo"
import { compose } from "./utils"

export const createNavigator = update => {
  const router = new Navigo(null, true)
  const componentMap = {}
  const routes = {}
  let notFoundComponent = undefined

  return {
    register: (configs, notFound) => {
      configs.forEach(config => {
        const component = config.component
        componentMap[config.key] = component
        const updateFn = model =>
          Object.assign(model, { pageId: config.key, url: document.location.hash })
        routes[config.route] = {
          as: config.key,
          uses: params => {
            if (component.navigating) {
              component.navigating(params, func => update(compose(func, updateFn)))
            }
            else {
              update(updateFn)
            }
          }
        }
      })
      notFoundComponent = notFound

      if (notFoundComponent) {
        router.notFound(() =>
          update(model => Object.assign(model,
            { pageId: undefined, url: document.location.hash })))
      }
    },
    getComponent: pageId => componentMap[pageId] || notFoundComponent,
    getUrl: (id, params) => router.generate(id, params),
    navigateTo: (id, params) => router.navigate(router.generate(id, params)),
    start: () => router.on(routes).resolve()
  }
}
