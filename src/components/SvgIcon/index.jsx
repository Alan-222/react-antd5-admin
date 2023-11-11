import React from 'react'
import './SvgIcon.scss'

const SvgIcon = React.memo(({ width, height, name, color, className }) => {
  return (
    <svg className={className || 'icon-svg'} aria-hidden="true" width={width} height={height}>
      <use xlinkHref={'#icon-' + name} fill={color}></use>
    </svg>
  )
})

export default SvgIcon
