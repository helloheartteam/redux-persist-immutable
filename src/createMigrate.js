// @flow

import { DEFAULT_VERSION } from 'redux-persist/lib/constants'

export default function createMigrate(
  migrations,
  config
) {
  let { debug } = config || {}
  return function(
    state,
    currentVersion
  ) {
    if (!state) {
      if (process.env.NODE_ENV !== 'production' && debug)
        console.log('redux-persist: no inbound state, skipping migration')
      return Promise.resolve(undefined)
    }

    let inboundVersion = state._persist && state._persist.get('version') || _constants.DEFAULT_VERSION;

    if (inboundVersion === currentVersion) {
      if (process.env.NODE_ENV !== 'production' && debug)
        console.log('redux-persist: versions match, noop migration')
      return Promise.resolve(state)
    }
    if (inboundVersion > currentVersion) {
      if (process.env.NODE_ENV !== 'production')
        console.error('redux-persist: downgrading version is not supported')
      return Promise.resolve(state)
    }

    let migrationKeys = Object.keys(migrations)
      .map(ver => parseInt(ver))
      .filter(key => currentVersion >= key && key > inboundVersion)
      .sort((a, b) => a - b)

    if (process.env.NODE_ENV !== 'production' && debug)
      console.log('redux-persist: migrationKeys', migrationKeys)
    try {
      let migratedState = migrationKeys.reduce((state, versionKey) => {
        if (process.env.NODE_ENV !== 'production' && debug)
          console.log(
            'redux-persist: running migration for versionKey',
            versionKey
          )
        return migrations[versionKey](state)
      }, state)
      return Promise.resolve(migratedState)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
