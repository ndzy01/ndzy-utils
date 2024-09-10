import { message } from "antd"
import axios, { AxiosRequestHeaders } from "axios"

import { login } from "@/components/Login.tsx"

export const service = axios.create({
  baseURL: "https://ndzy-s.vercel.app", // 基础URL
  timeout: 60000, // 请求超时设置
  withCredentials: false, // 跨域请求是否需要携带 cookie
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders
    }

    return config
  },
  (error) => {
    Promise.reject(error).then()
  }
)

service.interceptors.response.use(
  (response) => {
    if (response?.data?.msg) {
      message.info({ content: response?.data?.msg }).then()
    }

    return response.data
  },
  (error) => {
    if (error?.response?.data?.statusCode === 401) {
      message.error({ content: "登录失效，请重新登录" }).then()
      login()

      return
    }

    message.error({ content: "出错了，请联系管理员" }).then()
  }
)

/**
 * 清除路由参数
 * @param params
 */
export const clearUrlParams = (params: string[]) => {
  try {
    if (!params.length) return

    const url = new URL(window.location.href)

    for (const param of params) {
      url.searchParams.delete(param)
    }

    window.history.replaceState({}, document.title, url.toString())
  } catch (e) {
    //
  }
}

export interface Tree {
  id: string
  title: string
  order: number
  children?: Tree[]

  [k: string]: any
}

export const loop = (arr: Tree[]): Tree[] => {
  return [...arr]
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const newItem = {
        ...item,
        key: item.id,
        label: item.title,
        value: item.id,
      }

      if (Array.isArray(item.children) && item.children.length > 0) {
        newItem.children = loop(item.children)
      } else {
        delete newItem.children
      }

      return newItem
    })
}

export const findNodeById: (tree: Tree[], id: string) => string | null = (
  tree,
  id
) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      return tree[i].id
    } else if (tree[i].children) {
      // 如果有子节点，那么对子节点进行递归查找
      const result = findNodeById(tree[i].children!, id)
      if (result) {
        return result
      }
    }
  }

  return null // 如果没找到，返回null
}

// 递归函数来搜索具有特定标题的节点，并返回路径
export const findPath: (
  tree: Tree[],
  targetId: string,
  path?: string[]
) => string[] = (tree, targetId, path = []) => {
  for (const item of tree) {
    // 当前路径加上当前节点
    const newPath = [...path, item.title]

    if (item.id === targetId) {
      return newPath
    }

    // 如果该节点有子节点，递归搜索子节点
    if (item.children && item.children.length) {
      const result = findPath(item.children, targetId, newPath)
      if (result.length > 0) {
        return result // 如果在子树中找到目标，返回路径
      }
    }
  }

  // 如果没有找到目标
  return []
}
