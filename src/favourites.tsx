import * as React from 'react'
import {observer} from 'mobx-react'

import {List, ListItem} from 'material-ui/List'
import AppBar from 'material-ui/AppBar'
import Subheader from 'material-ui/Subheader'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'

import {FavouritesStore} from './store'
import {MainNav} from './nav'

// TODO: consider a way of injecting the store into components to make testing components cleaner.
const store = new FavouritesStore()

@observer
export class FavouritesList extends React.Component<{}, {}> {
  render() {
    // TODO: consider refactoring this.
    const content = []
    const sortedTypes = store.favourites.entries().sort( ([typeA, ], [typeB, ]) => typeA.localeCompare(typeB) )
    for (const [type, items] of sortedTypes) {
      const sortedItems = items.entries().sort( ([, itemA], [, itemB]) => itemA.title.localeCompare(itemB.title) )
      if (sortedItems.length > 0) {
        content.push(<Subheader key={type} style={{textTransform: 'capitalize'}}>{type}</Subheader>)
        for (const [id, item] of sortedItems) {
          content.push(
            <ListItem key={`${type}${id}`} href={`#/${type}/${id}/`}>
              <FavouriteToggler resourceType={type} id={id} title={item.title} />
              {item.title}  
            </ListItem>
          )
        }
      }
    }

    return (
      <section>
        <AppBar title="Favourites" iconElementLeft={<MainNav />} />
        <List>{content}</List>
      </section>
    )
  }
}

function FavouriteTogglerComponent(props: {resourceType: string, id: string, title: string}) {
  const {resourceType, id, title} = props
  const isFavourited = store.isFavourited(resourceType, id)
  return (
    <FlatButton
      icon={<FontIcon className="fa fa-star" color={isFavourited ? 'gold' : 'white'} />}
      hoverColor={'transparent'}
      onMouseDown={e => {e.stopPropagation()}}
      onClick={e => {
        // Otherwise it navigates when the parent has a href.
        e.preventDefault()
        store.toggle(resourceType, id, title)
      }}
    />
  )
}

export const FavouriteToggler = observer(FavouriteTogglerComponent)