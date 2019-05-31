import { findRouteSegment } from "meiosis-routing/state";

export const accept = state => {
  if (findRouteSegment(state.route.arrive, "Beer")) {
    return { pleaseWait: true };
  } else if (findRouteSegment(state.route.leave, "Beer")) {
    return { beers: null };
  }
  return null;
};
