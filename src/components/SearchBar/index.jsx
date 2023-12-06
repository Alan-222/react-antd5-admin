import React, { createElement, useId, useState } from 'react'
import { Card, Form, Button, Input, Space, Select, Row, Col, DatePicker } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

const SearchBar = ({ name, formItemList, getSearchParams }) => {
  // form 表单实例
  const [searchForm] = Form.useForm()
  const [advancedSearch, setAdvancedSearch] = useState(false)
  const uniqueId = useId()
  const onFinish = (values) => {
    getSearchParams(values)
  }
  const onReset = () => {
    searchForm.resetFields()
    getSearchParams({})
  }
  // 表单输入式组件
  const formComponents = {
    select: ({ type, selectvalues = [], callback = () => {}, ...restProps }) =>
      createElement(
        Select,
        { onChange: (v) => callback(v), ...restProps },
        selectvalues.map((v) => createElement(Select.Option, { key: v.value, value: v.value }, v.label))
      ),
    input: ({ type, ...restProps }) => <Input {...restProps} />,
    datePicker: ({ type, ...restProps }) => <DatePicker format="YYYY-MM-DD" {...restProps} />
  }
  return (
    <Card>
      <Form
        form={searchForm}
        name={uniqueId + 'queryForm'}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="inline"
        onFinish={onFinish}>
        <Row justify="start" gutter={[20, 20]} style={{ width: '100%' }}>
          {formItemList &&
            formItemList.slice(0, 3).map((item, index) => {
              // 取出输入类组件的类型，无则默认input
              const { type = 'input' } = item.valueCompProps
              // 依据类型返回对应的组件
              const C = formComponents[type]
              // 输出不用的type属性以便传入输入类组件
              delete item.valueCompProps.type
              return (
                <Col span={6} key={index}>
                  <Form.Item {...item.formItemProps}>{C(item.valueCompProps)}</Form.Item>
                </Col>
              )
            })}
          {formItemList && (
            <Col span={6}>
              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button onClick={onReset}>重置</Button>
                  {formItemList.length > 3 && (
                    <Button
                      type="link"
                      icon={<PlusCircleOutlined />}
                      onClick={() => setAdvancedSearch((value) => !value)}>
                      高级搜索
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Col>
          )}
          {advancedSearch &&
            formItemList.length > 3 &&
            formItemList.slice(3).map((item, index) => {
              const { type = 'input' } = item.valueCompProps
              const C = formComponents[type]
              return (
                <Col span={6} key={3 + index}>
                  <Form.Item {...item.formItemProps}>{C(item.valueCompProps)}</Form.Item>
                </Col>
              )
            })}
        </Row>
      </Form>
    </Card>
  )
}

export default SearchBar
