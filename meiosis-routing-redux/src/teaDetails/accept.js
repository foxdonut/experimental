import { DEL } from "mergerino";
import { findRouteSegment, whenPresent } from "meiosis-routing/state";

import { teaMap } from "./data";

export const accept = state => {
  const patches = [];

  whenPresent(findRouteSegment(state.route.arrive, "TeaDetails"), arrive => {
    const id = arrive.params.id;
    const description = teaMap[id].description;
    patches.push({ tea: { [id]: description } });
  });

  whenPresent(findRouteSegment(state.route.leave, "TeaDetails"), leave => {
    const id = leave.params.id;
    patches.push({ tea: { [id]: DEL } });
  });

  return patches;
};
