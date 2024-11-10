import { useState } from "react"
import { LoginOutlined } from "@ant-design/icons"
import { useLocalStorageState, useSessionStorageState } from "ahooks"
import { Drawer, FloatButton, Input } from "antd"

const LoginInput = () => {
  const [token, setToken] = useLocalStorageState<string | undefined>("token")
  const [token1, setToken1] = useSessionStorageState<string | undefined>(
    "token"
  )

  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      <FloatButton
        icon={<LoginOutlined />}
        type="primary"
        style={{ insetInlineEnd: 24 }}
        onClick={showDrawer}
      />

      <Drawer title="登录" onClose={onClose} open={open}>
        <Input
          value={token}
          onChange={(e) => {
            setToken(e.target.value)
            setToken1(e.target.value)
          }}
        />
        <Input
          value={token1}
          onChange={(e) => {
            setToken(e.target.value)
            setToken1(e.target.value)
          }}
          style={{ display: "none" }}
        />
      </Drawer>
    </>
  )
}

export default LoginInput
