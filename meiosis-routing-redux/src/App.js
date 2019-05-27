import { connect } from 'react-redux';

import { Root } from './root';

export const createApp = actions =>
  connect(state => ({ state }), { actions })(Root);
