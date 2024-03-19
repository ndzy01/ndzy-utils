// @ts-ignore
import { initCloud } from '@wxcloud/cloud-sdk';
import { isEmpty } from 'lodash';

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
        resolve(res);
      })
      .catch(() => {
        reject('出错了，请联系管理员！');
      });
  });
};

export default service;
