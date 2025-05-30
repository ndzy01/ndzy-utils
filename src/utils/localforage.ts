import CryptoJS from "crypto-js"
import localforage from "localforage"

interface StorageManagerConfig {
  driver?: string[] // 存储驱动选项
  name?: string // 数据库名称
  storeName?: string // 存储名称
  encryptKey?: string // 加密密钥
}

export type keyTypes = "token-sql" | "token-s"

const INTERNAL_KEY = Symbol("internal")
class StorageManager {
  // @ts-ignore
  static #instance: StorageManager | null = null
  private store: LocalForage
  private encryptKey?: string

  private constructor(config: StorageManagerConfig, key: symbol) {
    if (key !== INTERNAL_KEY) {
      throw new Error(
        "Use StorageManager.getInstance() to get the singleton instance."
      )
    }

    this.store = localforage.createInstance({
      driver: config.driver || [
        localforage.INDEXEDDB,
        localforage.LOCALSTORAGE,
      ],
      name: config.name || "ndzy",
      storeName: config.storeName || "default",
    })

    this.encryptKey = config.encryptKey
  }

  static getInstance(config: StorageManagerConfig = {}): StorageManager {
    if (StorageManager.#instance === null) {
      StorageManager.#instance = new StorageManager(config, INTERNAL_KEY)
    }
    return StorageManager.#instance
  }

  // @ts-ignore
  #encrypt(data: string): string {
    if (!this.encryptKey) return data
    try {
      return CryptoJS.AES.encrypt(data, this.encryptKey).toString()
    } catch (error) {
      console.error("Encryption error:", error)
      return data
    }
  }

  // @ts-ignore
  #decrypt(data: string): string {
    if (!this.encryptKey) return data
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptKey)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error("Decryption error:", error)
      return data
    }
  }

  async setItem<T>(
    key: keyTypes,
    value: T,
    options?: { encrypt?: boolean }
  ): Promise<void> {
    try {
      let data = JSON.stringify(value)
      if (options?.encrypt && this.encryptKey) {
        data = this.#encrypt(data)
      }
      await this.store.setItem(key, data)
    } catch (error) {
      console.error(`Error setting item for key ${key}:`, error)
    }
  }

  async getItem<T>(
    key: keyTypes,
    options?: { decrypt?: boolean }
  ): Promise<T | null> {
    try {
      const data = await this.store.getItem<string>(key)
      if (data === null) return null
      let result = data
      if (options?.decrypt && this.encryptKey) {
        result = this.#decrypt(result)
      }
      return JSON.parse(result) as T
    } catch (error) {
      console.error(`Error retrieving item for key ${key}:`, error)
      return null
    }
  }

  async removeItem(key: keyTypes): Promise<void> {
    try {
      await this.store.removeItem(key)
    } catch (error) {
      console.error(`Error removing item for key ${key}:`, error)
    }
  }

  async clear(): Promise<void> {
    try {
      await this.store.clear()
    } catch (error) {
      console.error("Error clearing storage:", error)
    }
  }

  async keys(): Promise<string[]> {
    try {
      return await this.store.keys()
    } catch (error) {
      console.error("Error retrieving keys:", error)
      return []
    }
  }
}

const indexedStorage = StorageManager.getInstance({
  name: "ndzy",
  encryptKey: "ndzy@2025",
})

export default indexedStorage
