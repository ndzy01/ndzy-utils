import React, { useEffect } from "react"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import { Button, Spin } from "antd"

import { service } from "./utils/http"
import indexedStorage from "./utils/localforage"

const GoogleLogin = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId="762510051045-6mr3lvmk5ii5io3f45bj054pnok848c5.apps.googleusercontent.com">
      <C>{children}</C>
    </GoogleOAuthProvider>
  )
}

const C = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = React.useState(true)
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      service({
        url: "/user/google",
        method: "post",
        data: {
          access_token: credentialResponse?.access_token,
        },
      }).then((res: any) => {
        indexedStorage.setItem("token-s", res.token)
      })
    },
    onError: () => {
      console.log("Login Failed")
    },
  })

  const isAuth = () => {
    service({
      url: "/app/auth",
      method: "get",
    }).then(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    isAuth()
  }, [])

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          login()
        }}
      >
        GoogleLogin
      </Button>
      {loading ? <Spin /> : children}
    </>
  )
}

export default GoogleLogin
