import React, { useEffect, useState } from 'react'
import { Tree, Button, message } from 'antd'
import authApi from '@/api/auth'
import roleApi from '@/api/role'
const RoleAuthTree = ({ role_id, roleAuths, toggleAssignStatus }) => {
  // 权限树的数据
  const [treeData, setTreeData] = useState([])
  // 勾选的复选框数组
  const [checkedKeys, setCheckedKeys] = useState([])
  // 勾选复选框回调
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue)
  }

  const onCancel = () => {
    setCheckedKeys({ checked: [], halfChecked: [] })
    toggleAssignStatus(false)
  }

  const onSubmit = async () => {
    await roleApi.resource.updRes(role_id, { all_ids: checkedKeys.checked })
    message.success('分配角色权限成功')
    toggleAssignStatus(false)
  }
  useEffect(() => {
    const fetchAuthTree = async () => {
      const { data } = await authApi.options.getAuth()
      setTreeData(data)
      // 设置勾选复选框为传入角色权限数据
      setCheckedKeys((checkedKeys) => ({ ...checkedKeys, checked: roleAuths }))
    }
    fetchAuthTree()
  }, [role_id, roleAuths])
  return (
    <>
      {treeData.length > 0 && (
        <Tree
          checkable
          defaultExpandAll={true}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          checkStrictly
          treeData={treeData}
        />
      )}
      <div style={{ textAlign: 'center' }}>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" style={{ marginLeft: 32 }} onClick={onSubmit}>
          确认
        </Button>
      </div>
    </>
  )
}
export default RoleAuthTree
