import Mapper from "url-mapper"

export const createNavigator = update => {
  const componentMap = {}
  const navigateToMap = {}
  const routeMap = {}
  const routeHandlerMap = {}
  const mapper = new Mapper()

  return {
    register: configs => {
      configs.forEach(config => {
        const component = config.component
        componentMap[config.key] = component
        const handler = params => {
          if (component.navigating) {
            component.navigating(params)
          }
          else {
            update(model => Object.assign(model, { pageId: config.key, params }))
          }
        }
        navigateToMap[config.key] = handler
        if (config.route) {
          routeMap[config.key] = config.route
          routeHandlerMap[config.route] = handler
        }
      })
    },
    getComponent: pageId => componentMap[pageId],
    navigateTo: (id, params) => {
      const target = navigateToMap[id]
      if (target) {
        target(params)
      }
    },
    handleUrl: url => {
      console.log("handleUrl:", url)
      const matchedRoute = mapper.map(url, routeHandlerMap)
      if (matchedRoute) {
        matchedRoute.match(matchedRoute.values)
      }
    },
    getUrl: (id, params = {}) => {
      const route = routeMap[id]
      return route && "#" + mapper.stringify(route, params)
    }
  }
}
