import { setupStores } from "@/lib/setupStore"
import { makeAutoObservable } from "mobx"

import { Demo } from "./demo"

export class RootStore {
  loading: {
    [k: string]: boolean
  } = { loading: false }
  demo: Demo

  constructor() {
    this.demo = new Demo(this)

    makeAutoObservable(this)
  }

  setLoading(value: boolean, key = "loading") {
    this.loading[key] = value
  }
}

export const { StoreContext, useStores, withStores } =
  setupStores<RootStore>(RootStore)
