import { DEL } from "mergerino";
import { findRouteSegment, whenPresent } from "meiosis-routing/state";

import { beverageMap } from "./data";

export const accept = state => {
  const patches = [];

  whenPresent(findRouteSegment(state.route.arrive, "Beverage"), arrive => {
    const id = arrive.params.id;
    const description = beverageMap[id].description;
    patches.push({ beverage: { [id]: description } });
  });

  whenPresent(findRouteSegment(state.route.leave, "Beverage"), leave => {
    const id = leave.params.id;
    patches.push({ beverage: { [id]: DEL } });
  });

  return patches;
};
