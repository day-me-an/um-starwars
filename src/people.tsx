import * as React from 'react'
import {RouteComponentProps} from 'react-router'

interface PersonListProps {

}

export class PersonList extends React.Component<PersonListProps, {}> {
  render() {
    return (
      <h1>people list</h1>
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
