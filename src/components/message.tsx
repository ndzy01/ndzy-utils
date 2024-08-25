import { CSSProperties, ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"
import { createRoot } from "react-dom/client"

import "@/components/index.css"

interface MessageProps {
  onClose?: () => void
  className?: string
  content: ReactNode
  duration?: number
  style?: CSSProperties
}

const createContainer = (className: string) => {
  let container = document.querySelector(`.${className}-container`)

  if (!container) {
    container = document.createElement("div")
    container.className = `${className}-container`
    document.body.appendChild(container)
  }

  return container
}

export const Message = ({
  content,
  onClose,
  className = "message",
  duration = 3,
  style,
}: MessageProps) => {
  useEffect(() => {
    if (!duration || !onClose) return

    const timer = setTimeout(onClose, duration * 1000)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    content && (
      <div className={className} style={{ ...(style || {}) }}>
        {content}
      </div>
    )
  )
}

export const message = (params: MessageProps) => {
  const container = createContainer("message")
  const notificationElement = document.createElement("div")
  notificationElement.id = `message_${Date.now()}`
  notificationElement.className = `message-wrapper`
  container.appendChild(notificationElement)
  const root = createRoot(notificationElement)

  const removeNotification = () => {
    root.unmount()
    notificationElement.remove()

    if (!container.hasChildNodes()) {
      container.remove()
    }
  }

  root.render(
    createPortal(
      <Message onClose={removeNotification} {...params} />,
      notificationElement
    )
  )
}
