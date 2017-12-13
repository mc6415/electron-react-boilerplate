/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import ProfilePage from './components/ProfilePage';

export default () => (
  <App>
    <Switch>
      <Route path="/counter" component={CounterPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
