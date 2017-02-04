import * as React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default function App(props: React.Props<{}>) {
  // Material UI requires a theme provider.
  return <MuiThemeProvider>{props.children}</MuiThemeProvider>
}