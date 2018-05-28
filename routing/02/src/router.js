export const createRouter = update => {
  const componentMap = {}

  return {
    register: Component => {
      componentMap[Component.pageId] = Component
    },
    navigateTo: (pageId, params) => {
      const Component = componentMap[pageId]

      if (Component && Component.navigateTo) {
        Component.navigateTo(params)
      }
      else {
        update({ pageId, params })
      }
    },
    getComponent: pageId => componentMap[pageId]
  }
}
