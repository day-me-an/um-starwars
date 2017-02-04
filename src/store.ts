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