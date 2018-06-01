import Navigo from "navigo"

export const createNavigator = update => {
  const router = new Navigo(null, true)
  const componentMap = {}
  const routes = {}

  return {
    register: configs => {
      configs.forEach(config => {
        const component = config.component
        componentMap[config.key] = component
        routes[config.route] = {
          as: config.key,
          uses: params => {
            if (component.navigating) {
              component.navigating(params)
            }
            else {
              update(model => Object.assign(model, { pageId: config.key, params }))
            }
          }
        }
      })
    },
    getComponent: pageId => componentMap[pageId],
    getLink: (id, params) => router.generate(id, params),
    navigateTo: (id, params) => router.navigate(router.generate(id, params)),
    start: () => router.on(routes).resolve()
  }
}
