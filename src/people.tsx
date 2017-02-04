import * as React from 'react'
import {RouteComponentProps} from 'react-router'

import RaisedButton from 'material-ui/RaisedButton'

interface PersonListProps {

}

export class PersonList extends React.Component<PersonListProps, {}> {
  render() {
    return (
      <section>
        <RaisedButton label="Load More" />
      </section>
    )
  }
}

interface PersonRouteProps {
  personId: string
}

export class Person extends React.Component<RouteComponentProps<{}, PersonRouteProps>, {}> {
  render() {
    return (
      <h1>i'm {this.props.routeParams.personId}</h1>
    )
  }
}
