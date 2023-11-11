import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal } from 'antd'
// forwardRef : 传递弹窗组件的ref
const CustomModal = forwardRef(({ title, children }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 取消事件
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  // useImperativeHandle：自定义父组件ref.current接收到的方法
  useImperativeHandle(
    ref,
    () => ({
      toggleShowStatus: (status) => {
        /** 改变状态 */
        setIsModalOpen(status)
      }
    }),
    []
  )

  return (
    <Modal title={title} open={isModalOpen} footer={null} onCancel={handleCancel}>
      {children}
    </Modal>
  )
})
export default CustomModal
