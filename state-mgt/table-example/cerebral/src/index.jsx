import React from "react";
import { render } from "react-dom";
import { controller, App } from "./App.jsx";
import { Container } from "@cerebral/react";

render(
  <Container controller={controller}>
    <App />
  </Container>,
  document.getElementById("app")
);
