import axios, { AxiosInstance, AxiosRequestHeaders } from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { message } from "@/components/message.tsx"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

class AxiosService {
  private static instance: AxiosInstance

  public static getInstance(url: string): AxiosInstance {
    if (!AxiosService.instance) {
      AxiosService.instance = axios.create({
        baseURL: url, // 基础URL
        timeout: 60000, // 请求超时设置
        withCredentials: false, // 跨域请求是否需要携带 cookie
      })
    }

    return AxiosService.instance
  }
}

/**
 * 请求实例
 * @param url
 */
export const createAxiosInstance = (url: string) => {
  const axiosInstance = AxiosService.getInstance(url)

  // 创建请求拦截
  axiosInstance.interceptors.request.use(
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

  // 创建响应拦截
  axiosInstance.interceptors.response.use(
    (res) => {
      message({ content: res.data.msg })

      return res.data
    },
    (error) => {
      if (error?.response?.data?.statusCode === 401) {
        message({ content: "登录失效，请重新登录" })

        return
      }

      message({ content: "出错了，请联系管理员" })
    }
  )

  return axiosInstance
}

export const service = createAxiosInstance("https://ndzy-s.vercel.app")

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
