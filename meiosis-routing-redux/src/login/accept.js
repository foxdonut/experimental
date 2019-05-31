import { findRouteSegment } from "meiosis-routing/state";

import { navigateTo } from "../routes";

export const preAccept = state => {
  const currentLogin = findRouteSegment(state.route.current, "Login");
  const previousLogin = findRouteSegment(state.route.previous, "Login");

  if (
    !currentLogin &&
    previousLogin &&
    !state.user &&
    (state.login.username || state.login.password) &&
    // eslint-disable-next-line no-restricted-globals
    !confirm("You have unsaved data. Continue?")
  ) {
    return navigateTo([previousLogin]);
  }
};

export const postAccept = state => {
  if (findRouteSegment(state.route.arrive, "Login")) {
    return {
      login: {
        username: "",
        password: ""
      }
    };
  } else if (findRouteSegment(state.route.leave, "Login")) {
    return { login: null };
  }
  return null;
};
