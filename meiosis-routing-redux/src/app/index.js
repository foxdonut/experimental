import { connect } from "react-redux";

import { Route, routes, navigateTo } from "../routes";
import { login } from "../login";
import { settings } from "../settings";
import { tea } from "../tea";
import { teaDetails } from "../teaDetails";
import { coffee } from "../coffee";
import { beer } from "../beer";
import { beverage } from "../beverage";
import { brewer } from "../brewer";
import { Root } from "../root";

export const createApp = initialRoute => ({
  Initial: () => navigateTo(initialRoute || [Route.Home()]),

  Actions: update =>
    Object.assign(
      {},
      routes.Actions(update),
      login.Actions(update),
      settings.Actions(update)
    ),

  acceptors: [
    settings.accept,
    login.preAccept,
    routes.accept,
    login.postAccept,
    tea.accept,
    teaDetails.accept,
    coffee.accept,
    beer.accept,
    beverage.accept,
    brewer.accept
  ],

  services: [
    tea.service,
    coffee.service,
    beer.service
  ]
});

export const connectApp = actions =>
  connect(state => ({ state }), actions)(Root);