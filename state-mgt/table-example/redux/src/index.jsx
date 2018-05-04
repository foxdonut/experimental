import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { App, store } from "./App.jsx";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
