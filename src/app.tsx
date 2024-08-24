import React, { useState } from "react"
import { service } from "@/utils.ts"
import { AxiosInstance } from "axios"

import { createContext } from "./createContext.tsx"

const NDZY_NAME = "NDZY"

interface NdzyContextType {
  loading: { [k: string]: boolean }
  setLoading: (v: boolean, key?: string) => void
  service: AxiosInstance
}

const [NdzyProvider, useNdzyContext] = createContext<NdzyContextType>(NDZY_NAME)

export const useStore = () => useNdzyContext(NDZY_NAME)

const App = (props: { children: React.ReactNode }) => {
  const { children } = props

  const [loading, setLoading] = useState<{ [k: string]: boolean }>({
    app: false,
  })

  return (
    <NdzyProvider
      loading={loading}
      setLoading={(v, key = "app") => setLoading({ ...loading, [key]: v })}
      service={service}
    >
      {children}
    </NdzyProvider>
  )
}

export default App
