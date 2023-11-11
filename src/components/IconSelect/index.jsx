import React, { useState } from 'react'
import { Input, Tooltip } from 'antd'
import { getNameList } from './index'
import SvgIcon from '@/components/SvgIcon'
import './IconSelect.scss'

export default function IconSelect(props) {
  // const [iconName, setIconName] = useState()
  const [iconList, setIconList] = useState(getNameList())
  const filterIcons = (iconName) => {
    setIconList(getNameList())
    if (iconName) {
      setIconList(getNameList().filter((item) => item.indexOf(iconName) !== -1))
    }
  }

  const selectedIcon = (name) => {
    props.selected(name)
  }
  return (
    <div className="iconSelect">
      <Input.Search placeholder="请输入图标名称" onSearch={(value) => filterIcons(value)} enterButton></Input.Search>
      <div className="iconSelect-list">
        {iconList.map((item, index) => (
          <Tooltip title={item} placement="bottom" color="blue" key={index}>
            <span onClick={() => selectedIcon(item)}>
              <SvgIcon color="#999" name={item} className="iconSelect-item" key={index} />
            </span>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
