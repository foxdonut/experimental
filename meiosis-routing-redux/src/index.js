import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore, createAction } from 'redux-starter-kit'
import { Provider } from 'react-redux';
import merge from 'mergerino';

import { createApp } from './App';
import { login } from './login';
import { settings } from './settings';
import { Route, routes } from './routes';
import { router } from './router';

const preloadedState = { route: { current: [Route.Home()] } };

const update = createAction("UPDATE");
const combine = patches => model => merge(model, ...patches);

const actions =
  Object.assign(
    {},
    routes.Actions({ update, combine }),
    login.Actions({ update, combine }),
    settings.Actions({ update, combine })
  );

const App = createApp(actions);

const reducer = (state, action) => merge(state, action.payload);

const store = configureStore({
  preloadedState,
  reducer,
  devTools: process.env.NODE_ENV !== 'production'
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

router.start({ navigateTo: actions.navigateTo });
