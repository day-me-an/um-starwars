import * as React from 'react'
import {RouteComponentProps, hashHistory} from 'react-router'

import {getResourceTitle} from './util'
import {FavouriteToggler} from './favourites'
import {MainNav} from './nav'

import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import {List, ListItem} from 'material-ui/List'
import CircularProgress from 'material-ui/CircularProgress'
import AppBar from 'material-ui/AppBar'
import Subheader from 'material-ui/Subheader'
import Chip from 'material-ui/Chip'

interface ResourceDetailRouteProps {
  resourceName: string
  id: string
}

interface ResourceDetailState {
  status: 'loading' | 'done' | 'error'
  item: any
  error: string
}

type ResourceDetailProps = RouteComponentProps<{}, ResourceDetailRouteProps>

export class ResourceDetail extends React.Component<ResourceDetailProps, ResourceDetailState> {
  constructor(props: ResourceDetailProps) {
    super(props)
    // Initial state.
    this.state = {
      status: 'loading',
      item: null,
      error: null,
    }
    // Fetch the resource.
    this.load(props.routeParams.resourceName, props.routeParams.id)
  }

  componentWillReceiveProps(nextProps: ResourceDetailProps) {
    // Load new resource if props change from react-router as it doesn't get unmounted.
    if (nextProps.routeParams.resourceName !== this.props.routeParams.resourceName 
        || nextProps.routeParams.id !== this.props.routeParams.id) {
      this.load(nextProps.routeParams.resourceName, nextProps.routeParams.id)
    }
  }

  async load(resourceName, id) {
    try {
      const resp = await fetch(`http://swapi.co/api/${resourceName}/${id}/`)
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
    const item = this.state.item
    const title = item ? getResourceTitle(item) : null
    return (
      <section>
        <AppBar
          title={title}
          iconElementLeft={<MainNav />}
          iconElementRight={
            <FavouriteToggler
              resourceType={this.props.routeParams.resourceName}
              id={this.props.routeParams.id}
              title={title}
            />
          }
        />
        <FlatButton
          href={`#/${this.props.routeParams.resourceName}/`}
          label={`View all ${this.props.routeParams.resourceName}`}
          primary
          icon={<FontIcon className="fa fa-arrow-left" />}
        />
        {this.state.status == 'done' ? <ResourceViewer resourceName={this.props.routeParams.resourceName} item={item} /> : null}
      </section>
    )
  }
}

/**
 * Returns a resource viewer based on the resource type.
 */
function ResourceViewer(props: {resourceName: string, item: any}) {
  // TODO: possibly implement specialised viewers for each resource type.
  switch (props.resourceName) {
    default:
      // A resource viewer that tries to intelligently display *any* resource.
      return <SmartResourceViewer item={props.item} />
  }
}

export function isSwapiUrl(value): boolean {
  return /^http:\/\/swapi\.co\/api\//.test(value)
}

export function isLinkedResourceProperty(key: string, value): boolean {
  // Is the property referencing multiple linked resources? 
  if (Array.isArray(value) && value.every(isSwapiUrl))
    return true
  // Or is there just one?
 if (isSwapiUrl(value))
    return true
  return false
}

export function isBasicTextProperty(key: string, value) {
  return typeof value == 'string' && !isLinkedResourceProperty(key, value)
}

export function prettyName(key: string) {
  return key.replace(/_/g, ' ')
}

export function isRelevant(key, value) {
  return ['created', 'edited', 'url'].indexOf(key) === -1
}

function relevantFields(item: any) {
  const sorted = Object.entries(item)
    // Exclude ignored fields.
    .filter( ([key, value]) => isRelevant(key, value) )
    // Prettify key names.
    .map( ([key, value]) => [prettyName(key), value] )
    // Sort them alphabetically by key name.
    .sort( ([a, ], [b, ]) => a.localeCompare(b) )
  // Separate them by type.
  return {
    text: sorted.filter( ([key, value]) => isBasicTextProperty(key, value) ),
    linked: sorted.filter( ([key, value]) => isLinkedResourceProperty(key, value) ),
  }
}

/**
 * Displays relevant text and linked fields of an item.
 */
function SmartResourceViewer(props: {item: any}) {
  const fields = relevantFields(props.item)
  return (
    <List>
      {fields.text.map(([field, value]) => <ListItem primaryText={<span style={{textTransform: 'capitalize'}}>{field}</span>} secondaryText={value} key={field} />)}
      {fields.linked.map(([field, urls]) => <LinkedResourcesField name={field} urls={urls} key={field} />)}
    </List>
  )
}

function LinkedResourcesField(props: {name: string, urls: string[]}) {
  return (
    <ListItem
      primaryText={<span style={{textTransform: 'capitalize'}}>{props.name}</span>}
      secondaryText={<span>{[].concat(props.urls).map(url => <LinkedResourceChip url={url} key={url} />)}</span>}
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
  _mounted: boolean = false

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

  componentDidMount() { 
    this._mounted = true
  }

  componentWillUnmount() {
    this._mounted = false
  }

  async load() {
    try {
      const resp = await fetch(this.props.url)
      if (!resp.ok) {
        throw resp.statusText
      }
      const record = await resp.json()
      if (this._mounted)
        this.setState({title: getResourceTitle(record)})
    } catch (reason) {
      if (this._mounted)      
        this.setState({title: 'Unknown'})
    }
  }

  navigate() {
    hashHistory.push(`/${this.resourceName}/${this.id}/`)
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <Chip style={{margin: 5}} onTouchTap={this.navigate.bind(this)}>{this.state.title}</Chip>
    )
  }
}