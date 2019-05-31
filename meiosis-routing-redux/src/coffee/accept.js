import { findRouteSegment } from "meiosis-routing/state";

export const accept = state => {
  if (findRouteSegment(state.route.arrive, "Coffee")) {
    return { pleaseWait: true };
  } else if (findRouteSegment(state.route.leave, "Coffee")) {
    return { coffees: null };
  }
  return null;
};
