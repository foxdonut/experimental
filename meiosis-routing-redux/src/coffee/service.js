import { findRouteSegment } from "meiosis-routing/state";

import { coffees } from "../beverage/data";

export const service = ({ state, update }) => {
  if (findRouteSegment(state.route.arrive, "Coffee")) {
    setTimeout(
      () =>
        update({
          pleaseWait: false,
          coffees
        }),
      1000
    );
  }
};
