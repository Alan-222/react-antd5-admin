import React from 'react'
import { Table } from 'antd'
// 导入自定义hook
import useFetchTableData from '@/hooks/useFetchTableData'
const CustomTable = ({ fetchMethod, columns, requestParam, onParamChange, ...resetTableProps }) => {
  // 请求表格数据
  const { loading, tableData } = useFetchTableData(fetchMethod, requestParam, onParamChange)

  // 翻页重设参数
  const onTableChange = (page) => {
    onParamChange({ pageSize: page.pageSize, current: page.current })
  }

  return (
    <Table
      {...resetTableProps}
      onChange={onTableChange}
      loading={loading}
      dataSource={tableData.tableData}
      columns={columns}
      pagination={{
        pageSize: requestParam.pageSize ?? 5,
        current: requestParam.current ?? 1,
        total: tableData.total,
        showTotal: (t) => <span style={{ color: '#333' }}>共{t}条</span>
      }}
    />
  )
}
export default CustomTable
