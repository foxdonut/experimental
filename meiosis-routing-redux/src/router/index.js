import createRouteMatcher from "feather-route-matcher";
// import queryString from "query-string";
import qs from "qs";
import { createFeatherRouter } from "meiosis-routing/router-helper";

// import Mapper from "url-mapper";
// import urlon from "urlon";
// import { createUrlMapperRouter } from "meiosis-routing/router-helper";

import { Route, routeConfig } from "../routes";

export const router = createFeatherRouter({
  createRouteMatcher,
  queryString: qs,
  routeConfig,
  defaultRoute: [Route.NotFound()]
});

/*
export const router = createUrlMapperRouter({
  Mapper,
  queryString: urlon,
  routeConfig,
  defaultRoute: [Route.Home()]
});
*/
