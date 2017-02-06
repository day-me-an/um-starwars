import * as React from 'react'
import {Router, Route, hashHistory, IndexRoute} from 'react-router'

import App from './app'
import {PersonList, Person} from './people'

export default (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="people/" component={PersonList}></Route>
      <Route path="people/:personId/" component={Person}></Route>
    </Route>
  </Router>
)