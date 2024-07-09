import { makeAutoObservable } from "mobx"

import { RootStore } from "."

// TODO-n 修改 state 类型定义
interface StateDemo {
  count: number
}

// TODO-n 修改名称
export class Demo {
  setLoading: (value: boolean, key?: string) => void
  updateState: (data: Partial<StateDemo>) => void
  resetState: (data: Partial<StateDemo>) => void
  state: StateDemo = {
    count: 0,
  }

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true })

    // TODO-n 修改 key
    this.setLoading = (value: boolean, key = "demo") => {
      rootStore.setLoading(value, key)
    }

    this.resetState = (data) => {
      this.state = { ...this.state, ...data }
    }

    this.updateState = (data) => {
      this.state = { ...this.state, ...data }
    }
  }

  // 计算属性
  get total() {
    console.log("Computing...")
    return this.state.count + 1
  }

  async fAsync() {
    this.setLoading(true)
    // TODO-n
    await new Promise((res) => {
      setTimeout(() => {
        res("xxx")
      }, 3000)
    })
    this.setLoading(false)
  }
}
