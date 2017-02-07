import * as React from 'react'

import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import Divider from 'material-ui/Divider'

export function MainNav(props: {}) {
  return (
    <IconMenu
      iconButtonElement={<IconButton><FontIcon className="fa fa-bars" color="white" /></IconButton>}
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      <MenuItem primaryText="Favourites" href="#/favs/" />
      <Divider />
      <MenuItem primaryText="People" href="#/people/" />
      <MenuItem primaryText="Planets" href="#/planets/" />
      <MenuItem primaryText="Films" href="#/films/" />
      <MenuItem primaryText="Species" href="#/species/" />
      <MenuItem primaryText="Vehicles" href="#/vehicles/" />
      <MenuItem primaryText="Starships" href="#/starships/" />
    </IconMenu>
  )
}