import * as React from 'react'
import {Router, Route, hashHistory, IndexRoute} from 'react-router'

import App from './app'
import {ResourceList} from './list'
import {ResourceDetail} from './detail'

export default (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path=":resourceName/" component={ResourceList}></Route>
      <Route path=":resourceName/:id/" component={ResourceDetail}></Route>
    </Route>
  </Router>
)