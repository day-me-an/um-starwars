import {observable} from 'mobx'

// Approach inspired from an OCaml talk by a guy from Jane Street Capital.
type State = {status: 'loading'}
           | {status: 'done', json: any}
           | {status: 'error', reason: string}

export class PageStore {
  @observable state: State = {status: 'loading'}

  async load(url: string) {
    this.state = {status: 'loading'}
    try {
      const resp = await fetch(url)
      if (!resp.ok) {
        throw resp.statusText
      }
      const json = await resp.json()
      this.state = {status: 'done', json}
    } catch (reason) {
      this.state = {status: 'error', reason}
    }
  }
}

interface FavouriteStore {
  [resourceType: string]: {
    [id: string]: FavouriteItem
  }
}

interface FavouriteItem {
  title: string
}

export class FavouritesStore {
  @observable favourites: FavouriteStore = {}

  toggle(resourceType: string, id: string, title: string) {
    // Add an object for this resource type if it doesn't exist.
    if (!this.favourites.hasOwnProperty(resourceType)) {
      this.favourites[resourceType] = {}
    }
    const resources = this.favourites[resourceType]
    // Add or remove it.
    if (resources.hasOwnProperty(id)) {
      delete resources[id]
    } else {
      resources[id] = {title}
    }
  }
}