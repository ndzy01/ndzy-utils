import React, { useEffect, useState } from "react"
import { AxiosInstance } from "axios"

import { createContext } from "./createContext"
import { loop, service, Tree } from "./utils"

const NDZY_NAME = "NDZY"

interface NdzyContextType {
  loading: boolean
  setLoading: (v: boolean) => void
  service: AxiosInstance
  articles: Tree[]
  article?: Tree
  api: {
    article: {
      query: () => Promise<void>
      del: (id: string) => Promise<void>
      find: (id: string) => Promise<void>
      save: (id: string, params: any) => Promise<void>
      create: (params: any) => Promise<void>
    }
  }
}

const [NdzyProvider, useNdzyContext] = createContext<NdzyContextType>(NDZY_NAME)

export const useStore = () => useNdzyContext(NDZY_NAME)

const App = (props: { children: React.ReactNode }) => {
  const { children } = props

  const [loading, setLoading] = useState(false)
  const [articles, setArticles] = useState<Tree[]>([])
  const [article, setArticle] = useState()

  const query = async () => {
    setLoading(true)
    const data: any = await service({ url: "/article", method: "GET" })
    setLoading(false)
    setArticles(loop(data?.data || []))
  }

  const del = async (id: string) => {
    setLoading(true)
    await service({ url: `/article/${id}`, method: "DELETE" })
    setLoading(false)
    query().then()
  }

  const save = async (id: string, params: any) => {
    setLoading(true)
    await service({ url: `/article/${id}`, method: "PATCH", data: params })
    setLoading(false)
    setArticle(undefined)
    query().then()
  }

  const create = async (params: any) => {
    setLoading(true)
    await service({ url: "/article", method: "POST", data: params })
    setLoading(false)
    query().then()
  }

  const find = async (id: string) => {
    setLoading(true)
    const data: any = await service({ url: `/article/${id}`, method: "GET" })
    setLoading(false)
    setArticle(data?.data)

    query().then()
  }

  useEffect(() => {
    query().then()
  }, [])

  return (
    <NdzyProvider
      loading={loading}
      setLoading={setLoading}
      service={service}
      articles={articles}
      article={article}
      api={{ article: { query, del, find, save, create } }}
    >
      {children}
    </NdzyProvider>
  )
}

export default App
