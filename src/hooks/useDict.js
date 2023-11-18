import { useState, useEffect } from 'react'
import dictApi from '@/api/dict'
// 自定义Hook，用于获取字典数据
const useDict = (dictName) => {
  const [dictionary, setDictionary] = useState([])

  useEffect(() => {
    const fetchDictionary = async () => {
      // 调用接口获取字典值
      const { data } = await dictApi.manage.queryByName(dictName)
      const options = data.map((item) => {
        return { label: item.item_text, value: item.item_value }
      })
      setDictionary(options)
    }

    fetchDictionary()
  }, [dictName])

  return dictionary
}
export default useDict
