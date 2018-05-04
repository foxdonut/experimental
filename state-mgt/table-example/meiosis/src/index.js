import { render } from "react-dom";
import flyd from "flyd";
import createApp from "./App.jsx";

const update = flyd.stream();
const app = createApp(update);
const states = flyd.scan((model, func) => func(model), app.model(), update).map(app.state);
states.map(state => render(app.view(state), document.getElementById("app")));
