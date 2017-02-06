import * as React from 'react'
import {RouteComponentProps, hashHistory} from 'react-router'

import {getResourceTitle} from './util'

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

const resourceListStyles = {
  loadBtn: {
    display: 'block',
    width: '10em',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}

interface Paginatable {
  count: number
  next: string
  results: any[]
}

export class ResourceList extends React.Component<RouteComponentProps<{}, ResourceListRoute>, ResourceListState> {
  constructor(props) {
    super(props)
    // Initial state.
    this.state = {
      status: 'initial-load',
      // Yes, pages do *start* at 1 and not 0 on SWAPI.
      nextPage: 1,
      items: [],
      error: null,
    }
  }

  async load() {
    try {
      const resp = await fetch(`http://swapi.co/api/${this.props.routeParams.resourceName}/?page=${this.state.nextPage}`)
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

  componentWillMount() {
    this.load()
  }

  loadMore() {
    this.setState({status: 'incrementing'})
    this.load()
  }

  openItem(url: string) {
    
    // Matches the entity id at the end of the URL. http://swapi.co/api/people/7/ => 7
    const match = url.match(/\/([0-9]+)\/$/)
    if (match) {
      const [_, id] = match
      hashHistory.push(`${this.props.routeParams.resourceName}/${id}/`)
    } else {
      throw `Couldn't open ${url}`
    }
  }

  render() {
    return (
      <section>
        <AppBar title={this.props.routeParams.resourceName} titleStyle={{textTransform: 'capitalize'}} />
        <List>
          {this.state.items.map(person => <PersonItem item={person} key={person.url} onClick={() => this.openItem(person.url)} />)}
        </List>
        {this.state.nextPage ? <LoadBtn isLoading={this.state.status == 'incrementing'} loadMore={this.loadMore.bind(this)} /> : null}
      </section>
    )
  }
}

function LoadBtn(props: {isLoading: boolean, loadMore: () => void}) {
  if (props.isLoading) {
    return <CircularProgress style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
  } else {
    return <RaisedButton style={resourceListStyles.loadBtn} label="Load More" onClick={props.loadMore} />
  }
}

function PersonItem(props: {item: any, onClick: () => void}) {
  return <ListItem primaryText={getResourceTitle(props.item)} onClick={props.onClick} />
}