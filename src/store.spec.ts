import {expect} from 'chai'
import * as fetchMock from 'fetch-mock'
import {autorun} from 'mobx'

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

  it(`state should be observable via mobx`, function(done) {
    const ps = new PageStore()
    let call = 0
    const disposer = autorun(() => {
      switch(call) {
        case 0:
          expect(ps.state.status).to.equal('loading')
          // Can't change an observable from within autorun.
          setTimeout(function() {
            // Changing it should trigger autorun again.
            ps.state.status = 'error'
          }, 0)
          break
        case 1:
          expect(ps.state.status).to.equal('error')
          disposer()
          done()
          break
      }
      call++
    })
  })
})