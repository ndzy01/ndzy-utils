import React, {
  FormEvent,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react"

// 定义表单上下文的类型
interface FormContextType<T> {
  values: T
  setValues: (values: T) => void
}

// 创建表单上下文
const FormContext = React.createContext<FormContextType<any> | undefined>(
  undefined
)

// 自定义钩子 useField
const useField = <K extends keyof T, T = any>(name: K) => {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error("useField must be used within a FormContext.Provider")
  }

  const { values, setValues } = context

  const setValue = (value: T[K]) =>
    setValues({
      ...values,
      [name]: value,
    })

  return [values[name], setValue]
}

// FormItem 组件
export interface FormItemProps<T> {
  name: keyof T
  children: ReactElement
}

const FormItem = <T,>({ name, children }: FormItemProps<T>) => {
  const [value, setValue] = useField(name)
  const handleChange = (event: any) => {
    let newValue

    if (event && event.target !== undefined) {
      // 处理常见的 input, select, textarea 元素
      if (event.target.type === "checkbox") {
        newValue = event.target.checked // 如果是 checkbox, 获取 checked 属性
      } else {
        newValue = event.target.value // 否则获取 value 属性
      }
    } else {
      // 处理自定义组件或者直接传值的情况
      newValue = event
    }

    setValue(newValue)
  }

  const child = React.Children.only(children)
  return React.cloneElement(child, {
    value,
    onChange: handleChange,
  })
}

// Form 组件
interface FormProps<T> {
  children: ReactNode
  initialValues?: T
  onSubmit?: (values: T) => void
}

const Form = <T,>({
  children,
  initialValues = {} as T,
  onSubmit,
}: FormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <FormContext.Provider value={{ values, setValues }}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  )
}

export { Form, FormItem, useField, FormContext }
