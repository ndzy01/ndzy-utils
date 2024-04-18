import React from 'react';
// @ts-ignore
import { initCloud } from '@wxcloud/cloud-sdk';
import { isEmpty } from 'lodash';
import { Button, Form, Input, Modal, message } from 'antd';
import './index.css';
import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

const login = (service: any) => {
  Modal.info({
    style: { maxHeight: 600 },
    className: 'ndzy-login-modal',
    content: (
      <>
        <Form
          name="login"
          onFinish={(values) => {
            service({
              url: '/user/login',
              method: 'POST',
              data: values,
            }).then((res: any) => {
              if (res && res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                window.location.reload();
              }

              Modal.destroyAll();
            });
          }}
          scrollToFirstError
        >
          <Form.Item name="mobile" label="手机号" rules={[{ required: true, message: '请输入你的手机号!' }]}>
            <Input className="w-100" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </>
    ),
    footer: null,
  });
};

const cloud = initCloud();
const c = cloud.Cloud({
  identityless: true,
  // 资源方 AppID
  resourceAppid: 'wxf18966ace3bbbd97',
  // 资源方环境 ID
  resourceEnv: 'prod-3gjeiq7x1fbed11e',
});
c.init();

// 处理 get 请求参数
export const objectToQueryString = (obj: any) => {
  return Object.keys(obj)
    .map((key) => (obj[key] ? `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}` : ''))
    .filter((item) => item)
    .join('&');
};

const service = (options: {
  url: string;
  method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'PATCH';
  data?: any;
  params?: any;
}): Promise<{ data: any; code: number; msg: string; [k: string]: any }> => {
  const { url = '', data = {}, params = {} } = options;
  let path = url;
  const token = localStorage.getItem('token');
  const header: any = {
    'X-WX-SERVICE': 'ndzy-service',
  };

  if (token) {
    header.Authorization = 'Basic' + ' ' + token;
  }

  if (options.method === 'GET' && !isEmpty(params)) {
    path += '?' + objectToQueryString(params);
  }

  return new Promise((resolve, reject) => {
    c.callContainer({
      ...options,
      config: {
        env: 'prod-3gjeiq7x1fbed11e',
      },
      path,
      header,
      method: options.method,
      data,
    })
      .then((res: { data: any; code: number; msg: string; [k: string]: any }) => {
        if (res?.statusCode === 401) {
          Modal.info({
            style: { maxHeight: 600 },
            className: 'ndzy-login-modal',
            content: (
              <>
                <Form
                  name="login"
                  onFinish={(values) => {
                    service({
                      url: '/users/login',
                      method: 'POST',
                      data: values,
                    }).then((res: any) => {
                      if (res && res.data && res.data.token) {
                        localStorage.setItem('token', res.data.token);
                        window.location.reload();
                      }

                      Modal.destroyAll();
                    });
                  }}
                  scrollToFirstError
                >
                  <Form.Item name="mobile" label="手机号" rules={[{ required: true, message: '请输入你的手机号!' }]}>
                    <Input className="w-100" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                      {
                        required: true,
                        message: '请输入密码!',
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ),
            footer: null,
          });
        }

        if (res.data.status === 1) {
          message.error(res.data.msg);
        }

        if (res.data.status === 0) {
          message.success(res.data.msg);
        }

        resolve(res.data);
      })
      .catch((error: any) => {
        console.log(error);

        reject('出错了，请联系管理员！');
      });
  });
};

export default service;

// ------
class AxiosService {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance(url: string): AxiosInstance {
    if (!AxiosService.instance) {
      AxiosService.instance = axios.create({
        baseURL: url, // 基础URL
        timeout: 60000, // 请求超时设置
        withCredentials: false, // 跨域请求是否需要携带 cookie
      });
    }
    return AxiosService.instance;
  }
}

export const createAxiosInstance = (url: string) => {
  const axiosInstance = AxiosService.getInstance(url);
  // 创建请求拦截
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers = { Authorization: 'Basic' + ' ' + token } as AxiosRequestHeaders;
      }

      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );
  // 创建响应拦截
  axiosInstance.interceptors.response.use(
    (res) => {
      if (res.data.statusCode === 401) {
        login(axiosInstance);
      }
      const data = res.data;

      if (res.data.status === 1) {
        message.error(res.data.msg);
      }

      if (res.data.status === 0) {
        message.success(res.data.msg);
      }

      return data;
    },
    () => {
      message.error('出错了');
      return Promise.reject('出错了');
    },
  );

  return axiosInstance;
};
