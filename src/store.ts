// Approach inspired from an OCaml talk by a guy from Jane Street Capital.
type State = {status: 'loading'}
           | {status: 'done', json: any}
           | {status: 'error', reason: string}

export class PageStore {
  state: State = {status: 'loading'}

  load(url: string) {
    this.state = {status: 'loading'}
    return fetch(url)
      .then(resp => {
        if (resp.ok) {
          return resp.json()
        } else {
          return Promise.reject(resp.statusText)
        }
      })
      .then(json => {
        this.state = {status: 'done', json}
      })
      .catch(reason => {
        this.state = {status: 'error', reason, }
      })
  }
}