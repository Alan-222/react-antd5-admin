// 使用 require.context 获取指定文件夹下的所有 SVG 文件
const importAll = (r) => {
  // r为require.context执行后的返回函数，接收一个request参数，同时也是一个对象，有keys、resolve、id属性
  const svgs = {}
  r.keys().map((key) => {
    // 用svg对象接收svg文件暴露的Module对象
    return (svgs[key] = r(key))
  })
  return Object.keys(svgs)
}
const iconList = importAll(require.context('@/assets/Icon/svg', false, /\.svg$/))

// 获取图标为icon-(*).svg名称数组, 例如[shouye, xitong, hedie, ...]
export const getNameList = () => {
  const regex = /icon-(.*?)\.svg/
  return iconList.map((item) => item.match(regex)[1])
}
