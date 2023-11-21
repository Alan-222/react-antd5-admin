import { useEffect, useState } from 'react'
const useFetchTableData = (fetchMethod, params, onParamChange) => {
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])

  // 获取表格数据
  async function fetchTableData() {
    try {
      setLoading(true)
      const {
        data: { count, rows }
      } = await fetchMethod({
        currentPage: params.current,
        ...params,
        current: undefined
      })

      setTableData({
        tableData: rows,
        total: count
      })
      // 如果删除页面最后一个元素且不是第一页，重置请求参数，且当前页数减去1
      if (!rows.length && params.current !== 1) {
        onParamChange({ pageSize: 5, current: params.current - 1 })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTableData()
  }, [params])
  return { loading, tableData }
}
export default useFetchTableData
