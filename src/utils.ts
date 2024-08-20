import axios, { AxiosRequestHeaders } from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { login } from "@/components/Login.tsx"
import { message } from "@/components/message.tsx"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

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
        Authorization: `Basic ${token}`,
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
    message({ content: response?.data?.msg })

    return response.data
  },
  (error) => {
    if (error?.response?.data?.statusCode === 401) {
      message({ content: "登录失效，请重新登录" })
      login()

      return
    }

    message({ content: "出错了，请联系管理员" })
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
