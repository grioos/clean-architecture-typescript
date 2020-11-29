import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'
import { SavePurchases } from '@/domain/usecases'
import { mockPurchases } from '@/data/tests'

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey: string
  insertKey: string
  insertValues: Array<SavePurchases.Params> = []

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }


  insert(key: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }

  simuleteDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error() })
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { throw new Error() })
  }
}

const mockPurcashes = (): Array<SavePurchases.Params> => [{
  id: '1',
  date: new Date(),
  value: 50
}, {
  id: '2',
  date: new Date(),
  value: 70
}]

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)

  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  test('Should not delete cache on suit.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('Should delete old cache on sut.save', async () => {
    const { cacheStore, sut } = makeSut()

    await sut.save(mockPurcashes())

    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('Should delete old cache on sut.save', async () => {
    const { cacheStore, sut } = makeSut()

    await sut.save(mockPurcashes())

    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simuleteDeleteError()

    const promise = sut.save(mockPurcashes())

    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })

  test('Should insert new Cache if delete succeds', async () => {
    const { cacheStore, sut } = makeSut()
    const purchases = mockPurcashes()

    await sut.save(purchases)

    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  })


  test('Should throw if insert throws', async () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateInsertError()

    const promise = sut.save(mockPurcashes())

    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })
})