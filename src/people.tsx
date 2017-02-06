import * as React from 'react'
import {RouteComponentProps, hashHistory} from 'react-router'
import {observer} from 'mobx-react'

import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List'
import CircularProgress from 'material-ui/CircularProgress'
import AppBar from 'material-ui/AppBar'
import Subheader from 'material-ui/Subheader'
import Chip from 'material-ui/Chip'

interface PersonRouteProps {
  personId: string
}

interface PersonState {
  status: 'loading' | 'done' | 'error'
  item: PersonType
  error: string
}

interface PersonType {
  // Bio.
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  // Links.
  homeworld: string
  starships: string[]
}

export class Person extends React.Component<RouteComponentProps<{}, PersonRouteProps>, PersonState> {
  constructor(props) {
    super(props)
    // Initial state.
    this.state = {
      status: 'loading',
      item: null,
      error: null,
    }
    // Fetch the entity.
    this.load()
  }

  async load() {
    try {
      const resp = await fetch(`http://swapi.co/api/people/${this.props.routeParams.personId}/`)
      if (!resp.ok) {
        throw resp.statusText
      }
      const json = await resp.json()
      this.setState({status: 'done', item: json})
    } catch (reason) {
      this.setState({status: 'error', error: reason})
    }
  }

  render() {
    const person = this.state.item
    return (
      <section>
        <AppBar title={person ? getTitle(person) : null} />
        {this.state.status == 'done' ? <PersonContent person={person} /> : null}
      </section>
    )
  }
}

const chipStyle = {
  margin: 5
}

function PersonContent(props: {person: PersonType}) {
  const {person} = props
  return (
    <List>
      <ListItem primaryText="Gender" secondaryText={`${person.gender}`} />
      <ListItem primaryText="Height" secondaryText={`${person.height}cm`} />
      <ListItem primaryText="Mass" secondaryText={`${person.mass}kg`} />
      <ListItem primaryText="Hair Colour" secondaryText={`${person.hair_color}`} />
      <ListItem primaryText="Skin Colour" secondaryText={`${person.skin_color}`} />
      <ListItem primaryText="Birth Year" secondaryText={`${person.birth_year}`} />

      <ListItem primaryText="Homeworld" secondaryText={<LinkedResourceChip url={person.homeworld} />} />
      <LinkedResourcesField name="Starships" urls={person.starships} />
    </List>
  )
}

function LinkedResourcesField(props: {name: string, urls: string[]}) {
  return (
    <ListItem
      primaryText={props.name}
      secondaryText={<span>{props.urls.map(url => <LinkedResourceChip url={url} key={url} />)}</span>}
    />
  )
}

interface LinkedResourceProps {
  url: string
}

interface LinkedResourceState {
  title: string
}

/**
 * Displays a Material UI Chip with inner text from requesting the resource. 
 */
class LinkedResourceChip extends React.Component<LinkedResourceProps, LinkedResourceState> {
  resourceName: string
  id: string

  constructor(props) {
    super(props)
    this.state = {
      title: "Loading"
    }
    // Get the resource type and ID for navigation purposes.
    const [_, resourceName, id] = this.props.url.match(/\/([a-z]+)\/([0-9]+)\/$/)
    this.resourceName = resourceName
    this.id = id
    // Fetch it so that a title can be found.
    this.load()
  }

  async load() {
    try {
      const resp = await fetch(this.props.url)
      if (!resp.ok) {
        throw resp.statusText
      }
      const record = await resp.json()
      this.setState({title: getTitle(record)})
    } catch (reason) {
      this.setState({title: 'Unknown'})
    }
  }

  navigate() {
    hashHistory.push(`${this.resourceName}/${this.id}/`)
  }

  render() {
    return (
      <Chip style={chipStyle} onTouchTap={this.navigate.bind(this)}>{this.state.title}</Chip>
    )
  }
}

/**
 * Attempts to return a field that can act as a title.
 * Most SWAPI entities have a `name`, but one uses `title`. 
 */
function getTitle(record: any): string {
  if (record.name)
    return record.name
  else if (record.title)
    return record.title
  else
    return "Unknown"
}