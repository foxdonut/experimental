import { findRouteSegment } from "meiosis-routing/state";

import { beers } from "../beverage/data";

export const service = ({ state, update }) => {
  if (findRouteSegment(state.route.arrive, "Beer")) {
    setTimeout(
      () =>
        update({
          pleaseWait: false,
          beers
        }),
      1000
    );
  }
};
