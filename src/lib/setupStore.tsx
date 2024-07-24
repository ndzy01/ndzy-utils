import { createContext, useContext } from "react"
import * as React from "react"

type Constructor<T = any> = new (...args: any[]) => T

type HOC = (
  Children: React.FC | React.ComponentClass
) => (props: Record<string, any>) => React.ReactElement

export const setupStores = <T,>(RootStore: Constructor) => {
  const rootStore = new RootStore()

  const StoreContext = createContext<{
    state: T
  }>({ state: rootStore })

  const useStores = () => {
    const { state } = useContext(StoreContext)

    return state
  }

  const withStores: HOC = (Children) => {
    return (props: Record<string, any>) => {
      return (
        <StoreContext.Provider value={{ state: rootStore }}>
          <Children {...props} />
        </StoreContext.Provider>
      )
    }
  }

  return { useStores, withStores, StoreContext }
}
