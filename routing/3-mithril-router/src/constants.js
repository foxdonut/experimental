import m from "mithril"

export const FormPage = "FormPage"
export const HomePage = "HomePage"
export const ListPage = "ListPage"
export const NotFoundPage = "NotFoundPage"

export const prefix = "#!"
export const href = link => ({ href: link, oncreate: m.route.link, onupdate: m.route.link })
