import * as React from 'react'
import {Router, Route, hashHistory, IndexRoute} from 'react-router'

import App from './app'
import {ResourceList} from './list'
import {Person} from './people'

export default (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path=":resourceName/" component={ResourceList}></Route>
      <Route path="people/:personId/" component={Person}></Route>
    </Route>
  </Router>
)