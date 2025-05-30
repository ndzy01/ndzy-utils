import { message } from "antd"
import axios, { type AxiosRequestHeaders } from "axios"

import indexedStorage from "./localforage"

export const service = axios.create({
  baseURL: "https://ndzy-s.vercel.app", // 基础URL
  timeout: 60000, // 请求超时设置
  withCredentials: false, // 跨域请求是否需要携带 cookie
})

service.interceptors.request.use(
  async (config) => {
    const token = await indexedStorage.getItem("token-s", { decrypt: true })

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
    if (response?.data?.message) {
      message.info({ content: response?.data?.message }).then()
    }

    return response.data
  },
  (error) => {
    if (error?.response?.data?.statusCode === 401) {
      message.error({ content: "登录过期，请重新登录" }).then()
      return
    }

    message.error({ content: "出错了，请联系管理员" }).then()
  }
)
