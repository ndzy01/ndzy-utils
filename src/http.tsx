// @ts-ignore
import { initCloud } from '@wxcloud/cloud-sdk';
import { isEmpty } from 'lodash';
import { Button, Form, Input, Modal, message } from 'antd';

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
                    <Button type="primary" htmlType="submit">
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
      .catch(() => {
        reject('出错了，请联系管理员！');
      });
  });
};

export default service;
