import { createSlice } from '@reduxjs/toolkit'

const tabSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabs: sessionStorage.getItem('tabs') ? JSON.parse(sessionStorage.getItem('tabs')) : []
  },
  reducers: {
    // 新增tab
    addTab: (state, action) => {
      state.tabs.push(action.payload)
      sessionStorage.setItem('tabs', JSON.stringify(state.tabs))
    },
    // 删除tab
    removeTab: (state, action) => {
      state.tabs = state.tabs.filter((tab) => tab.key !== action.payload)
      sessionStorage.setItem('tabs', JSON.stringify(state.tabs))
    },
    // 登出清空tabs
    clearTab: (state, action) => {
      state.tabs = []
      sessionStorage.removeItem('tabs')
    }
  }
})

export const { addTab, removeTab, clearTab } = tabSlice.actions
export default tabSlice
