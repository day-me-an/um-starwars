import {expect} from 'chai'
import * as fetchMock from 'fetch-mock'

import {PageStore} from './store'

describe('PageStore', function() {
  afterEach(function() {
    fetchMock.restore()
  })

  it(`'loading' state immeditately after calling load()`, function() {
    fetchMock.getOnce('*', {data: 'hello world'})
    const ps = new PageStore()
    ps.load('http://lol')
    expect(ps.state).to.deep.equal({status: 'loading'})
  })

  it(`'error' state after request fails`, async function() {
    fetchMock.getOnce('*', {status: 500})
    const ps = new PageStore()
    await ps.load('http://lol')
    expect(ps.state).to.contain({status: 'error'})
  })

  it(`'done' state after request succeeds`, async function() {
    const payload = {data: 'hello world'}
    fetchMock.getOnce('*', payload)
    const ps = new PageStore()
    await ps.load('http://lol')
    expect(ps.state).to.deep.equal({status: 'done', json: payload})
  })
})