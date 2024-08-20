import React from "react"

import { ArticleTreeProps } from "@/components/article-tree.tsx"

export const defaultPrefixCls = "ndzy"
export const defaultIconPrefixCls = "ndzyicon"

export interface ComponentStyleConfig {
  className?: string
  style?: React.CSSProperties
}

export type ArticleTreeConfig = ComponentStyleConfig &
  Pick<ArticleTreeProps, "classNames" | "styles">

export interface ConfigConsumerProps {
  rootPrefixCls?: string
  iconPrefixCls: string
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string
  articleTree?: ArticleTreeConfig
}

const defaultGetPrefixCls = (
  suffixCls?: string,
  customizePrefixCls?: string
) => {
  if (customizePrefixCls) {
    return customizePrefixCls
  }

  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

export const ConfigContext = React.createContext<ConfigConsumerProps>({
  getPrefixCls: defaultGetPrefixCls,
  iconPrefixCls: defaultIconPrefixCls,
  rootPrefixCls: defaultGetPrefixCls(),
})
