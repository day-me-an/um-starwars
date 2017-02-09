import {expect} from 'chai'
import * as fetchMock from 'fetch-mock'

import {prettyName, isSwapiUrl, isLinkedResourceProperty} from './detail'

describe('Smart Resource Viewer', function() {
  describe('prettyName', function() {
    it(`converts underscores to spaces`, function() {
      expect(prettyName('hello_world')).to.equal('hello world')
    })

    it(`converts multiple underscores to spaces`, function() {
      expect(prettyName('hello_there_world')).to.equal('hello there world')
    })

    it(`returns the whole word if there are no underscores`, function() {
      expect(prettyName('hello')).to.equal('hello')
    })
  })

  describe('isSwapiUrl', function() {
    it(`can determine if a string *is not* a SWAPI url`, function() {
      expect(isSwapiUrl('male')).to.be.false
    })

    it(`can determine if a string *is* a SWAPI url`, function() {
      expect(isSwapiUrl('http://swapi.co/api/planets/1/')).to.be.true
    })

    it(`can determine that an array *containing* a SWAPI url isn't a SWAPI url`, function() {
      expect(isSwapiUrl(['http://swapi.co/api/planets/1/'])).to.be.false
    })
  })

  describe('isLinkedResourceProperty', function() {
    it(`a non-URL string`, function() {
      expect(isLinkedResourceProperty('gender', 'male')).to.be.false
    })

    it(`a SWAPI URL string`, function() {
      expect(isLinkedResourceProperty('father', 'http://swapi.co/api/people/7/')).to.be.true
    })

    it(`a non-SWAPI URL string`, function() {
      expect(isLinkedResourceProperty('website', 'http://google.com')).to.be.false
    })

    it(`an array containing only SWAPI URL strings`, function() {
      expect(isLinkedResourceProperty('parents', ['http://swapi.co/api/people/7/'])).to.be.true
    })

    it(`an array of mixed data`, function() {
      expect(isLinkedResourceProperty('junk', ['http://swapi.co/api/people/7/', 'http://google.com', 123, null])).to.be.false
    })
  })
})