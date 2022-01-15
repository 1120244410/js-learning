// k-v cache for storage
let STORAGE_CACHE = {}

// Save storage value as variable
export const setStorage = (key, value) => {
  try {
    STORAGE_CACHE[key] = value
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    // eslint-disable-next-line
    console.error(err)
  }
}

// Get storage value as variable
export const getStorage = (key) => {
  try {
    // get value from cache
    const cacheResult = STORAGE_CACHE[key]
    if (cacheResult) return cacheResult

    // get value from storage
    const result = localStorage.getItem(key)
    return JSON.parse(result)
  } catch (err) {
    return undefined
  }
}

// Remove specific storage value
export const removeStorage = (key) => {
  delete STORAGE_CACHE[key]
  localStorage.removeItem(key)
}

// Clear all storage values
export const clearStorage = () => {
  STORAGE_CACHE = {}
  localStorage.clear()
}

export default {
  set: setStorage,
  get: getStorage,
  remove: removeStorage,
  clear: clearStorage
}
