import { LocalLoadPurchases } from '@/data/usecases'
import { CacheStoreSpy, mockPurchases, getCacheExpirationDate } from '@/data/tests'

type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalLoadPurchases(cacheStore, timestamp)

  return {
    sut,
    cacheStore
  }
}

describe('LocalLoadPurchases', () => {
  test('Should not delete or insert cache on suit.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  test('Should return empty list if load fails', async () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateFecthError()
    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })

  test('Should return a list of purchases if cache is valid', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    timestamp.setSeconds(timestamp.getSeconds() + 1)

    const { cacheStore, sut } = makeSut(timestamp)

    cacheStore.fetchResults = {
      timestamp,
      value: mockPurchases()
    }

    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual(cacheStore.fetchResults.value)
  })

  test('Should return an empty list if cache is expired', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    timestamp.setSeconds(timestamp.getSeconds() - 1)

    const { cacheStore, sut } = makeSut(currentDate)

    cacheStore.fetchResults = {
      timestamp,
      value: mockPurchases()
    }

    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })

  test('Should return an empty list if cache is on expiration date', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    timestamp.setSeconds(timestamp.getSeconds())

    const { cacheStore, sut } = makeSut(currentDate)

    cacheStore.fetchResults = {
      timestamp,
      value: mockPurchases()
    }

    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch, CacheStoreSpy.Action.delete])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })

  test('Should return an empty list if cache is empty', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    timestamp.setSeconds(timestamp.getSeconds() + 1)

    const { cacheStore, sut } = makeSut(currentDate)

    cacheStore.fetchResults = {
      timestamp,
      value: []
    }

    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual([])
  })
})