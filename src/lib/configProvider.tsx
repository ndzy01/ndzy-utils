import { ReactNode } from "react"

import {
  ConfigConsumerProps,
  ConfigContext,
  defaultIconPrefixCls,
  defaultPrefixCls,
} from "./configContext"

interface ConfigProviderProps extends Partial<ConfigConsumerProps> {
  children: ReactNode
}

const ConfigProvider = ({
  children,
  rootPrefixCls,
  iconPrefixCls,
  articleTree,
}: ConfigProviderProps) => {
  const baseConfig = {
    articleTree,
  }

  const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) {
      return customizePrefixCls
    }

    return suffixCls
      ? `${rootPrefixCls || defaultPrefixCls}-${suffixCls}`
      : rootPrefixCls || defaultPrefixCls
  }

  return (
    <ConfigContext.Provider
      value={{
        getPrefixCls,
        iconPrefixCls: iconPrefixCls || defaultIconPrefixCls,
        rootPrefixCls,
        ...baseConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
