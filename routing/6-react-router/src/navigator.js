import { compile } from "path-to-regexp"
import { NotFoundPage } from "./constants"

export const createNavigator = () => {
  const toPath = {}

  const getUrl = (id, params) => toPath[id](params)

  return {
    register: (configs, notFound) => {
      if (notFound) {
        configs.push({ key: NotFoundPage, component: notFound })
      }
      configs.forEach(config => {
        if (config.path) {
          toPath[config.key] = compile(config.path)
        }
      })
      return configs
    },
    getUrl
  }
}
