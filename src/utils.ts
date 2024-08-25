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
    message.info({ content: response?.data?.msg }).then()

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
