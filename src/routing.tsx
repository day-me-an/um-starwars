import * as React from 'react'
import {Router, Route, hashHistory, IndexRoute} from 'react-router'

import App from './app'
import {PersonList, Person} from './people'

export default (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={PersonList} />
      <Route path="person/:personId" component={Person}></Route>
    </Route>
  </Router>
)