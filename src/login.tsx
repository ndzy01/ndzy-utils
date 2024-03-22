import React from 'react';
import { Button, Form, Input, Modal, message } from 'antd';

const login = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    Modal.info({
      content: (
        <>
          <Form
            style={{ maxHeight: 800 }}
            name="login"
            onFinish={(values) => {
              if (values.mobile === '2024' && values.password === '2024') {
                resolve(true);
              } else {
                resolve(false);
              }
              Modal.destroyAll();
            }}
            scrollToFirstError
          >
            <Form.Item name="mobile" label="手机号" rules={[{ required: true, message: '请输入你的手机号!' }]}>
              <Input />
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
  });
};

export default login;
