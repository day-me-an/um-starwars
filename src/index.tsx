import * as React from 'react'
import * as ReactDOM from 'react-dom'

// Fixes "Unknown prop `onTouchTap`..." errors for Material UI.
import * as injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import Routing from './routing'

ReactDOM.render(Routing, document.getElementById('root'))