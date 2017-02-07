import {expect} from 'chai'
import {toJS} from 'mobx'

import {FavouritesStore} from './store'

describe('FavouritesStore', function() {
  it(`initial state is empty`, function() {
    const store = new FavouritesStore()
    expect(toJS(store.favourites)).to.deep.equal({})
  })

  describe('toggle', function() {
    it(`adds an item`, function() {
      const store = new FavouritesStore()
      store.toggle('people', '1', 'Luke')
      expect(toJS(store.favourites)).to.deep.equal({
        'people': {'1': {title: 'Luke'}}
      })
    })

    it(`removes an existing item`, function() {
      const store = new FavouritesStore()
      store.toggle('people', '1', 'Luke')
      store.toggle('people', '1', 'Luke')
      expect(toJS(store.favourites)).to.deep.equal({'people': {}})
    })
  })

  describe('isFavourited', function() {
    it(`returns true when an item *is not* favourited`, function() {
      const store = new FavouritesStore()
      expect(store.isFavourited('people', '1')).to.be.false
    })

    it(`returns false when an item *is* favourited`, function() {
      const store = new FavouritesStore()
      store.toggle('people', '1', 'Luke')
      expect(store.isFavourited('people', '1')).to.be.true
    })

    it(`returns false after an item is removed`, function() {
      const store = new FavouritesStore()
      store.toggle('people', '1', 'Luke')
      store.toggle('people', '1', 'Luke')
      expect(store.isFavourited('people', '1')).to.be.false
    })
  })
})