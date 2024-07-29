import React, { useContext, useEffect, useState } from "react"
import { ConfigContext } from "@/lib/configContext"
import classNames from "classnames"
import RCTree from "rc-tree"

import "rc-tree/assets/index.css"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button.tsx"

const loop = (arr: any[]): any[] => {
  return [...arr]
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const newItem = {
        ...item,
        key: item.id,
        label: item.title,
        value: item.id,
      }

      if (Array.isArray(item.children) && item.children.length > 0) {
        newItem.children = loop(item.children)
      } else {
        delete newItem.children
      }

      return newItem
    })
}

const findNodeById: any = (tree: any[], id: string) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      return tree[i]
    } else if (tree[i].children) {
      // 如果有子节点，那么对子节点进行递归查找
      const result = findNodeById(tree[i].children, id)
      if (result) {
        return result
      }
    }
  }

  return null // 如果没找到，返回null
}

// 递归函数来搜索具有特定标题的节点，并返回路径
const findPath: any = (data: any[], targetId: string, path = []) => {
  for (const item of data) {
    // 当前路径加上当前节点
    const newPath = [...path, item.title] // 或者使用item.id根据需要
    // 如果找到目标，返回路径
    if (item.id === targetId) {
      return newPath
    }
    // 如果该节点有子节点，递归搜索子节点
    if (item.children && item.children.length) {
      const result = findPath(item.children, targetId, newPath)
      if (result.length > 0) {
        return result // 如果在子树中找到目标，返回路径
      }
    }
  }
  // 如果没有找到目标
  return []
}

export interface ArticleTreeProps {
  placeholder: string
  data: any[]
  value?: string[]
  onChange?: (v: string[]) => void
  onEdit?: any
  onDel?: any
  height?: number
  rootClassName?: string
  prefixCls?: string
  className?: string
  style?: React.CSSProperties
  classNames?: {
    header?: string
    body?: string
    extra?: string
    title?: string
    actions?: string
    cover?: string
  }
  styles?: {
    header?: React.CSSProperties
    body?: React.CSSProperties
    extra?: React.CSSProperties
    title?: React.CSSProperties
    actions?: React.CSSProperties
    cover?: React.CSSProperties
  }
}

type ArticleTreeClassNamesModule = keyof Exclude<
  ArticleTreeProps["classNames"],
  undefined
>
type ArticleTreeStylesModule = keyof Exclude<
  ArticleTreeProps["styles"],
  undefined
>

const ArticleTree = React.forwardRef<any, ArticleTreeProps>((props, ref) => {
  const {
    data,
    value,
    onChange,
    placeholder,
    onEdit,
    onDel,
    height = 800,
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    style,
    classNames: customClassNames,
    styles: customStyles,
  } = props
  const { getPrefixCls, articleTree } = useContext(ConfigContext)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [s, setS] = useState("key1")
  const [innerValue, setInnerValue] = useState(value || [])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const prefixCls = getPrefixCls("article-tree", customizePrefixCls)
  const classString = classNames(
    prefixCls,
    // {
    //   [`${prefixCls}-loading`]: loading,
    //   [`${prefixCls}-bordered`]: bordered,
    //   [`${prefixCls}-hoverable`]: hoverable,
    //   [`${prefixCls}-contain-grid`]: isContainGrid,
    //   [`${prefixCls}-contain-tabs`]: tabList?.length,
    //   [`${prefixCls}-${mergedSize}`]: mergedSize,
    //   [`${prefixCls}-type-${type}`]: !!type,
    // },
    className,
    rootClassName,
    articleTree?.className
  )
  const mergedStyle: React.CSSProperties = { ...articleTree?.style, ...style }
  const moduleClass = (moduleName: ArticleTreeClassNamesModule) =>
    classNames(
      articleTree?.classNames?.[moduleName],
      customClassNames?.[moduleName]
    )

  const moduleStyle = (
    moduleName: ArticleTreeStylesModule
  ): React.CSSProperties => ({
    ...articleTree?.styles?.[moduleName],
    ...customStyles?.[moduleName],
  })

  console.log(moduleStyle("body"), moduleClass("body"))

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }

  useEffect(() => {
    if (value) {
      setInnerValue(value)
    }
  }, [value])

  if (data.length === 0) return

  return (
    <Accordion
      ref={ref}
      type="single"
      collapsible
      value={s}
      onValueChange={(value) => setS(value)}
      className={classString}
      style={mergedStyle}
    >
      <AccordionItem value="key1" className={`${prefixCls}-item`}>
        <AccordionTrigger className={`${prefixCls}-trigger`}>
          {innerValue.length > 0 ? (
            findNodeById(data, innerValue[0]) ? (
              <div className="flex items-center gap-4">
                {findPath(data, innerValue[0]).join(" / ")}

                {onEdit && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onEdit()
                    }}
                  >
                    编辑
                  </Button>
                )}

                {onDel && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onDel(findNodeById(data, innerValue[0]).id)
                    }}
                  >
                    删除
                  </Button>
                )}
              </div>
            ) : (
              placeholder
            )
          ) : (
            placeholder
          )}
        </AccordionTrigger>
        <AccordionContent>
          <RCTree
            virtual
            height={height}
            showLine
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(data)}
            selectedKeys={innerValue}
            onSelect={(keys: any) => {
              setInnerValue(keys)
              setS("")
              onChange && onChange(keys || [])
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
})

export { ArticleTree }
