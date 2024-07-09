import axios, { AxiosInstance, AxiosRequestHeaders } from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

class AxiosService {
  private static instance: AxiosInstance

  private constructor() {}

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
      Promise.reject(error)
    }
  )
  // 创建响应拦截
  axiosInstance.interceptors.response.use(
    (res) => {
      const data = res.data

      if (res.data.status === 1) {
        alert(res?.data?.msg)
      }

      if (res.data.status === 0) {
        alert(res?.data?.msg)
      }

      return data
    },
    (error) => {
      if (error?.response?.data?.statusCode === 401) {
        alert("登录失效，请重新登录")
        return
      }

      alert("出错了，请联系管理员")

      return Promise.reject("出错了，请联系管理员")
    }
  )

  return axiosInstance
}

export const service = createAxiosInstance("https://ndzy-s.vercel.app")
