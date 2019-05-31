import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore, createAction } from 'redux-starter-kit'
import { Provider } from 'react-redux';
import merge from 'mergerino';

import { createApp, connectApp } from './app';
import { router } from './router';

const compose = (f, g) => x => f(g(x));
const update = createAction("UPDATE");
const combine = patches => model => merge(model, ...patches);

const app = createApp(router.initialRoute);
const preloadedState = app.Initial();
const actions = app.Actions(update);

const singlePatch = patch => (Array.isArray(patch) ? combine(patch) : patch);

const accept =
  model => app.acceptors.reduce((mdl, acceptor) => merge(mdl, singlePatch(acceptor(mdl))), model);

const reducer = (state, action) => accept(merge(state, singlePatch(action.payload)));

const store = configureStore({
  preloadedState,
  reducer,
  devTools: process.env.NODE_ENV !== 'production'
});

const App = connectApp(actions);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

router.start({ navigateTo: compose(store.dispatch, actions.navigateTo) });

const dispatchUpdate = compose(store.dispatch, update);

const runServices = () => {
  app.services.forEach(service => service({
    state: store.getState(),
    update: dispatchUpdate
  }));
};

store.subscribe(runServices);

runServices();
