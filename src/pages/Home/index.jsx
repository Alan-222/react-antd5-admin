import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {Row, Col, Card, Avatar} from "antd";
import { UserOutlined, TeamOutlined, MenuOutlined, AppstoreOutlined, EllipsisOutlined} from "@ant-design/icons";
import classes from "./Home.module.scss";
// 导入图表库
import { Bar, Pie } from '@ant-design/plots';
// 导入api
import homeApi from '@/api/home'

const Home = () => {
  const navigate=useNavigate()
  // 条形图数据
  const [barData,setBarData]=useState([])
  const barDataObj=useMemo(()=>{
    const returnObj={}
    if(barData && barData.length) {
      barData.forEach(item => {
        returnObj[item.key] = item.value
      })
    }
    return returnObj
  },[barData])
  // 条形图配置
  const barConfig = {
    data:barData,
    height:300,
    xField: 'value',
    yField: 'entity',
    seriesField: 'entity',
    legend: {
      color: { size: 72, autoWrap: true, maxRows: 3, cols: 6 },
      position: 'top-left',
    },
  }
  // 饼图数据
  const [pieData,setPieData]=useState([])
  // 饼图配置
  const pieConfig = {
    appendPadding: 10,
    height: 300,
    data:pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          fontSize: 18,
          lineHeight:2,
          textOverflow: 'ellipsis',
        },
        content: '模块\n菜单数量',
      },
    },
  }

  // 跳转对应模块
  const onNavigation=(url)=>{
    navigate(url)
  }
  useEffect( ()=>{
    const getData=async ()=>{
      const {data:barData}=await homeApi.resource.entity()
      setBarData(barData)
      const {data : PieData}=  await homeApi.resource.module()
      setPieData(PieData)
    }
    getData()
  },[])
  return (
      <>
        <Row gutter={16} style={{marginBottom:20}}>
          <Col span={6}>
            <Card
                title='用户数'
                actions={[
                  <EllipsisOutlined key="ellipsis" onClick={()=>onNavigation('/system/user')}/>,
                ]}
            >
              <div className={classes['card-content']}>
                <Avatar style={{ backgroundColor: '#6CDAD4' }} icon={<UserOutlined /> } />
                <span>{ barDataObj.user }</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
                title="角色数"
                actions={[
                  <EllipsisOutlined key="ellipsis" onClick={()=>onNavigation('/system/role')}/>,
                ]}
            >
              <div className={classes['card-content']}>
                <Avatar style={{ backgroundColor: '#FA6F5E' }} icon={<TeamOutlined /> } />
                <span>{ barDataObj.role }</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
                title="菜单数"
                actions={[
                  <EllipsisOutlined key="ellipsis" onClick={()=>onNavigation('/system/menu')} />,
                ]}
            >
              <div className={classes['card-content']}>
                <Avatar style={{ backgroundColor: '#FEDB4E' }} icon={<MenuOutlined /> } />
                <span>{ barDataObj.menu }</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
                title="按钮数"
                actions={[
                  <EllipsisOutlined key="ellipsis" onClick={()=>onNavigation('/system/menu')} />,
                ]}
            >
              <div className={classes['card-content']}>
                <Avatar style={{ backgroundColor: '#B0E470' }} icon={<AppstoreOutlined /> } />
                <span>{ barDataObj.button }</span>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card
                title='系统数据条形图'
            >
              <Bar {...barConfig} />
            </Card>
          </Col>
          <Col span={12}>
            <Card
                title='模块菜单数量环图'
            >
              <Pie {...pieConfig} />
            </Card>
          </Col>
        </Row>
      </>
  )
}
export default Home
