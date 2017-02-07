import {observable, ObservableMap} from 'mobx'

export type ResourceFavourites = ObservableMap<FavouriteItem>
type FavouriteStore = ObservableMap<ResourceFavourites>

interface FavouriteItem {
  title: string
}

export class FavouritesStore {
  @observable favourites: FavouriteStore = observable.map<ResourceFavourites>()

  toggle(resourceType: string, id: string, title: string) {
    // Add a map for this resource type if it doesn't exist.
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

  isFavourited(resourceType: string, id: string) {
    return this.favourites.has(resourceType) && this.favourites.get(resourceType).has(id)
  }
}