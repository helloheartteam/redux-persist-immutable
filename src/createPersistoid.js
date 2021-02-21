import { Map, is } from 'immutable';
import { KEY_PREFIX } from 'redux-persist/lib/constants'

export default function createPersistoid(config) {
  // defaults
  const blacklist = config.blacklist || null
  const whitelist = config.whitelist || null
  const transforms = config.transforms || []
  const throttle = config.throttle || 0
  const storageKey = `${
    config.keyPrefix !== undefined ? config.keyPrefix : KEY_PREFIX
  }${config.key}`
  const storage = config.storage
  const serialize = config.serialize === false ? x => x : defaultSerialize

  // initialize stateful values
  let lastState = Map()
  let stagedState = {}
  let keysToProcess = []
  let timeIterator = null
  let writePromise = null

  const getKeys = state => state && state.keySeq().toArray() || []

  // update started getting only Immutable Maps as a Reducer Type
  const update = (state) => {
    // add any changed keys to the queue
    getKeys(state).forEach(key => {
      if (!passWhitelistBlacklist(key)) return // is keyspace ignored? noop
      if (is(lastState.get(key), state.get(key))) return // value unchanged? noop
      if (lastState.get(key) === state.get(key)) return // value unchanged? noop
      if (keysToProcess.indexOf(key) !== -1) return // is key already queued? noop
      keysToProcess.push(key) // add key to queue
    })

    //if any key is missing in the new state which was present in the lastState,
    //add it for processing too
    getKeys(lastState).forEach(key => {
      if (state.get(key) === undefined) {
        keysToProcess.push(key)
      }
    })

    // start the time iterator if not running (read: throttle)
    if (timeIterator === null) {
      timeIterator = setInterval(processNextKey, throttle)
    }

    lastState = state
  }

  function processNextKey() {
    if (keysToProcess.length === 0) {
      if (timeIterator) clearInterval(timeIterator)
      timeIterator = null
      return
    }

    let key = keysToProcess.shift()
    let endState = transforms.reduce((subState, transformer) => {
      return transformer.in(subState, key, lastState)
    }, lastState.get(key))

    if (endState !== undefined) {
      try {
        stagedState[key] = serialize(endState)
      } catch (err) {
        console.error(
          'redux-persist/createPersistoid: error serializing state',
          err
        )
      }
    } else {
      //if the endState is undefined, no need to persist the existing serialized content
      delete stagedState[key]
    }

    if (keysToProcess.length === 0) {
      writeStagedState()
    }
  }

  function writeStagedState() {
    // cleanup any removed keys just before write.
    Object.keys(stagedState).forEach(key => {
      if (lastState.get(key) === undefined) {
        delete stagedState[key]
      }
    })

    writePromise = storage
      .setItem(storageKey, serialize(stagedState))
      .catch(onWriteFail)
  }

  function passWhitelistBlacklist(key) {
    if (whitelist && whitelist.indexOf(key) === -1 && key !== '_persist')
      return false
    if (blacklist && blacklist.indexOf(key) !== -1) return false
    return true
  }

  function onWriteFail(err) {
    // @TODO add fail handlers (typically storage full)
    if (err && process.env.NODE_ENV !== 'production') {
      console.error('Error storing data', err)
    }
  }

  const flush = () => {
    while (keysToProcess.length !== 0) {
      processNextKey()
    }
    return writePromise || Promise.resolve()
  }

  // return `persistoid`
  return {
    update,
    flush,
  }
}

// @NOTE in the future this may be exposed via config
function defaultSerialize(data) {
  return JSON.stringify(data)
}
