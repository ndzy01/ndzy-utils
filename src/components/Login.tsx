import * as React from "react"
import { service } from "@/utils"
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Modal,
  type FormProps,
} from "antd"
import zhCN from "antd/locale/zh_CN"

const Login = () => {
  const [loading, setLoading] = React.useState<boolean>(false)

  type FieldType = {
    mobile?: string
    password?: string
  }

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setLoading(true)
    service({ url: "/user/login", method: "POST", data: values })
      .then((res) => {
        setLoading(false)
        if (res?.data?.token) {
          sessionStorage.setItem("token", res?.data?.token)
          window.location.reload()
          Modal.destroyAll()
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Form
        name="login"
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label="手机号"
          name="mobile"
          rules={[{ required: true, message: "手机号不能为空" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label="密码"
          name="password"
          rules={[{ required: true, message: "密码不能为空" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            登陆
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  )
}

export const login = () => {
  Modal.warn({
    title: "登录已失效，请重新登陆",
    content: <Login />,
    footer: null,
    zIndex: 999999999,
  })
}

export default Login
