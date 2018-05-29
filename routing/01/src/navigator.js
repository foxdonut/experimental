export const createNavigator = update => {
  const componentMap = {}

  return {
    register: Component => {
      componentMap[Component.pageId] = Component
    },
    navigate: (pageId, params) => {
      const Component = componentMap[pageId]

      if (Component && Component.navigate) {
        Component.navigate(params)
      }
      else {
        update(model => Object.assign(model, { pageId, params }))
      }
    },
    getComponent: pageId => componentMap[pageId]
  }
}
