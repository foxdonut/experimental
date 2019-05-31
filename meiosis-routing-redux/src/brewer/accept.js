import { DEL } from "mergerino";
import { findRouteSegment, whenPresent } from "meiosis-routing/state";

export const accept = state => {
  const patches = [];

  whenPresent(findRouteSegment(state.route.arrive, "Brewer"), arrive => {
    const id = arrive.params.id;
    patches.push({ brewer: { [id]: `Brewer of beverage ${id}` } });
  });

  whenPresent(findRouteSegment(state.route.leave, "Brewer"), leave => {
    const id = leave.params.id;
    patches.push({ brewer: { [id]: DEL } });
  });

  return patches;
};
