let { listeners, subscribe, bunching, destroy, change } = require('../store')

let loading, loaded
if (process.env.NODE_ENV === 'production') {
  loading = Symbol()
  loaded = Symbol()
} else {
  loading = Symbol('loading')
  loaded = Symbol('loaded')
}

class RemoteStore {
  constructor (id) {
    this[listeners] = []
    this.id = id
  }

  [subscribe] (listener) {
    this[listeners].push(listener)
    return () => {
      this[listeners] = this[listeners].filter(i => i !== listener)
      if (!this[listeners].length) {
        setTimeout(() => {
          if (!this[listeners].length && this.constructor.loaded) {
            if (this.constructor.loaded.delete(this.id)) {
              if (this[destroy]) this[destroy]()
            }
          }
        })
      }
    }
  }

  [change] (key, value, swallow) {
    if (this[key] === value) return
    this[key] = value
    if (!swallow) {
      if (!this[bunching]) {
        this[bunching] = {}
        setTimeout(() => {
          let changes = this[bunching]
          delete this[bunching]
          for (let listener of this[listeners]) {
            listener(this, changes)
          }
        })
      }
      this[bunching][key] = value
    }
  }
}

RemoteStore.load = function (id, client) {
  if (!this.loaded) {
    this.loaded = new Map()
  }
  if (!this.loaded.has(id)) {
    this.loaded.set(id, new this(id, client))
  }
  return this.loaded.get(id)
}

if (process.env.NODE_ENV !== 'production') {
  RemoteStore.prototype[change] = function (key, value, swallow) {
    if (this[key] === value) return
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      writable: false,
      value
    })
    if (!swallow) {
      if (!this[bunching]) {
        this[bunching] = {}
        setTimeout(() => {
          let changes = this[bunching]
          delete this[bunching]
          for (let listener of this[listeners]) {
            listener(this, changes)
          }
        })
      }
      this[bunching][key] = value
    }
  }
}

module.exports = {
  RemoteStore,
  loading,
  loaded
}
