import React, { useEffect, useState } from 'react'
import { Form, Input, Button, message, Radio, TreeSelect, Popover, InputNumber } from 'antd'
// 导入api
import authApi from '@/api/auth'
import IconSelect from '@/components/IconSelect'
import SvgIcon from '@/components/SvgIcon'

export default function MenuEditForm({ editType, auth_id, dict, onRefreshTable, toggleModalStatus }) {
  // 表单组件
  const [form] = Form.useForm()
  const [menuOptions, setMenuOptions] = useState([])
  const onCancel = () => {
    toggleModalStatus(false)
  }
  // 图标浮动框参数
  const [openPop, setOpenPop] = useState(false)
  const [selectIcon, setSelectIcon] = useState()
  const handleOpenChange = (newOpen) => {
    setOpenPop(newOpen)
  }
  // 选择图标后的事件
  const selected = (name) => {
    form.setFieldsValue({ icon: name })
    setSelectIcon(name)
    setOpenPop(false)
  }
  const iconSelectVDOM = (
    <Popover
      title="选择图标"
      content={<IconSelect selected={selected} />}
      open={openPop}
      onOpenChange={handleOpenChange}
      trigger="click">
      <Input
        id="menuEditForm_icon"
        value={form.getFieldValue('icon')}
        placeholder="点击选择图标"
        prefix={<SvgIcon name={selectIcon} onClick={() => setOpenPop(true)}></SvgIcon>}
      />
    </Popover>
  )
  const onFinish = async (value) => {
    if (auth_id && editType === 'edit') {
      // 当权限为目录类型时，将其组件路径设为Layout
      if (value.type === 'C') value = { ...value, component: 'Layout' }
      await authApi.manage.update(auth_id, value)
      message.success('修改信息成功')
    } else {
      await authApi.manage.add(value)
      message.success('添加成功')
    }
    onCancel()
    onRefreshTable({})
  }

  // 递归获取父级菜单选项
  const getMenuOptions = (menu) => {
    if (!menu || !menu.length) return
    const res = menu.map((item) => {
      return {
        value: item.value,
        title: item.label,
        children: item.children && item.children.length ? getMenuOptions(item.children) : undefined
      }
    })
    return res
  }

  useEffect(() => {
    // 清空表单
    form && form.resetFields()
    // 编辑回显值
    if (auth_id && editType === 'edit') {
      const fetchCurrentData = async () => {
        const {
          data: { parent_id, title, type, path, icon, redirect, component, permission, sort, hidden }
        } = await authApi.manage.queryById(auth_id)
        // 回显值
        if (icon) setSelectIcon(icon)
        else setSelectIcon(null)
        form.setFieldsValue({ parent_id, title, type, path, icon, redirect, component, permission, sort, hidden })
      }
      fetchCurrentData()
    }
    // 添加回显父级菜单
    if (auth_id && editType === 'add') {
      form.setFieldValue('parent_id', auth_id)
    }

    const fetchMenuOptions = async () => {
      const { data } = await authApi.options.getMenus()
      const originMenuOptions = [{ title: '顶层菜单', value: 0, children: [] }]
      originMenuOptions[0].children = getMenuOptions(data)
      setMenuOptions(originMenuOptions)
    }
    fetchMenuOptions()
  }, [auth_id, editType])
  return (
    <Form form={form} layout="vertical" name="menuEditForm" onFinish={onFinish}>
      <Form.Item name="parent_id" label="父级菜单" rules={[{ required: true, type: 'number' }]}>
        <TreeSelect
          showSearch
          placeholder="请选择父级菜单"
          allowClear
          treeDefaultExpandAll
          treeData={menuOptions.length > 0 && menuOptions}></TreeSelect>
      </Form.Item>
      <Form.Item name="title" label="权限名称" rules={[{ required: true, type: 'string', min: 1, max: 10 }]}>
        <Input />
      </Form.Item>
      <Form.Item name="type" label="权限类型" rules={[{ required: true, type: 'string' }]}>
        <Radio.Group buttonStyle="solid">
          {dict.authTypeDict.map((item) => (
            <Radio.Button value={item.value} key={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.type !== curValues.type}>
        {({ getFieldValue }) => {
          let fieldType = getFieldValue('type')
          if (fieldType === 'C') {
            return (
              <>
                <Form.Item name="path" label="路由路径" rules={[{ required: true, type: 'string', min: 1, max: 10 }]}>
                  <Input placeholder="例：home" />
                </Form.Item>
                <Form.Item name="icon" label="图标" rules={[{ required: true, type: 'string' }]}>
                  {iconSelectVDOM}
                </Form.Item>
                <Form.Item name="redirect" label="重定向路径" rules={[{ required: true, type: 'string', min: 1 }]}>
                  <Input placeholder="重定向地址,例如：/system/user" />
                </Form.Item>
              </>
            )
          } else if (fieldType === 'M') {
            return (
              <>
                <Form.Item name="path" label="路由路径" rules={[{ required: true, type: 'string', min: 1, max: 10 }]}>
                  <Input placeholder="例：home" />
                </Form.Item>
                <Form.Item name="icon" label="图标" rules={[{ required: true, type: 'string' }]}>
                  {iconSelectVDOM}
                </Form.Item>
                <Form.Item name="component" label="组件路径" rules={[{ required: true, type: 'string', min: 1 }]}>
                  <Input
                    addonBefore={'src/pages'}
                    placeholder="目录和文件首字母大写，例如/System/User/User，具体到组件文件路径（按文件路径来编写即可）"
                  />
                </Form.Item>
              </>
            )
          } else if (fieldType === 'B') {
            return (
              <Form.Item name="permission" label="权限标识" rules={[{ required: true, type: 'string', min: 1 }]}>
                <Input placeholder="[目录]:[模块名]:[按钮操作],例如system:user:add" />
              </Form.Item>
            )
          }
        }}
      </Form.Item>
      <Form.Item name="sort" label="排序" rules={[{ required: true, type: 'number' }]}>
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item name="hidden" label="状态" rules={[{ required: true, type: 'string' }]}>
        <Radio.Group buttonStyle="solid">
          {dict.hiddenDict.map((item) => (
            <Radio.Button value={item.value} key={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: 32 }}>
          确认
        </Button>
      </Form.Item>
    </Form>
  )
}
