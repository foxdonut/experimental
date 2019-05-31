import { findRouteSegment } from "meiosis-routing/state";

export const accept = state => {
  if (findRouteSegment(state.route.leave, "Tea")) {
    return { teas: null };
  }
  return null;
};
