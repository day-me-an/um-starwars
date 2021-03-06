import * as React from 'react'
import {RouteComponentProps, hashHistory} from 'react-router'

import {getResourceTitle} from './util'
import {MainNav} from './nav'

import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List'
import CircularProgress from 'material-ui/CircularProgress'
import AppBar from 'material-ui/AppBar'

interface ResourceListRoute {
  resourceName: string
}

interface ResourceListState {
  status: 'initial-load' | 'done' | 'incrementing' | 'error'
  nextPage: number
  items: any[]
  error: string
}

type ResourceListProps = RouteComponentProps<{}, ResourceListRoute>

interface Paginatable {
  count: number
  next: string
  results: any[]
}

const resourceListStyles = {
  loadBtn: {
    display: 'block',
    width: '10em',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}

export class ResourceList extends React.Component<ResourceListProps, ResourceListState> {
  constructor(props: ResourceListProps) {
    super(props)
    // Initial state.
    this.state = ResourceList.initialState()
    this.load(props.routeParams.resourceName)
  }

  static initialState(): ResourceListState {
    return {
      status: 'initial-load',
      // Yes, pages do *start* at 1 and not 0 on SWAPI.
      nextPage: 1,
      items: [],
      error: null,
    }
  }

  componentWillReceiveProps(nextProps: ResourceListProps) {
    if (nextProps.routeParams.resourceName !== this.props.routeParams.resourceName) {
      this.state = ResourceList.initialState()
      this.load(nextProps.routeParams.resourceName)
    }
  }

  async load(resourceName: string) {
    try {
      const resp = await fetch(`http://swapi.co/api/${resourceName}/?page=${this.state.nextPage}`)
      if (!resp.ok) {
        throw resp.statusText
      }
      const json: Paginatable = await resp.json()
      this.setState({
        status: 'done',
        items: this.state.items.concat(json.results),
        // Only increment the next page to load if one exists.
        nextPage: json.next ? this.state.nextPage + 1 : null,
      })
    } catch (reason) {
      this.setState({status: 'error', error: reason})
    }
  }

  loadMore() {
    this.setState({status: 'incrementing'})
    this.load(this.props.routeParams.resourceName)
  }

  render() {
    return (
      <section>
        <AppBar
          title={this.props.routeParams.resourceName}
          titleStyle={{textTransform: 'capitalize'}}
          iconElementLeft={<MainNav />}
        />
        <List>
          {this.state.items.map(item => <ListItem primaryText={getResourceTitle(item)} href={getItemUrl(item.url)} key={item.url} />)}
        </List>
        {this.state.nextPage ? <LoadBtn isLoading={this.state.status == 'incrementing'} loadMore={this.loadMore.bind(this)} /> : null}
      </section>
    )
  }
}

function getItemUrl(url) {
    // Matches the entity id at the end of the URL. http://swapi.co/api/people/7/ => 7
    const match = url.match(/\/([a-z]+)\/([0-9]+)\/$/)
    const [_, resourceName, id] = match
    return `#/${resourceName}/${id}/`
}

function LoadBtn(props: {isLoading: boolean, loadMore: () => void}) {
  if (props.isLoading) {
    return <CircularProgress style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
  } else {
    return <RaisedButton style={resourceListStyles.loadBtn} label="Load More" onClick={props.loadMore} />
  }
}