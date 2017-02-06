import {observable, autorun, ObservableMap} from 'mobx'

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

export type ResourceFavourites = ObservableMap<FavouriteItem>
type FavouriteStore = ObservableMap<ResourceFavourites>

interface FavouriteItem {
  title: string
}

export class FavouritesStore {
  @observable favourites: FavouriteStore = observable.map<ResourceFavourites>()

  toggle(resourceType: string, id: string, title: string) {
    // Add an object for this resource type if it doesn't exist.
    if (!this.favourites.has(resourceType)) {
      this.favourites.set(resourceType, observable.map<FavouriteItem>())
    }
    const resources = this.favourites.get(resourceType)
    // Add or remove it.
    if (resources.has(id)) {
      resources.delete(id)
    } else {
      resources.set(id, {title})
    }
  }

  // isFavourited(resourceType: string, id: string) {
  //   return this.favourites.has(resourceType) && this.favourites[resourceType].has(id)
  // }
}