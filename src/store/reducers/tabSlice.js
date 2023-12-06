import { createSlice } from '@reduxjs/toolkit'

const tabSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabs: []
  },
  reducers: {
    // 新增tab
    addTab: (state, action) => {
      state.tabs.push(action.payload)
    },
    // 删除tab
    removeTab: (state, action) => {
      state.tabs = state.tabs.filter((tab) => tab.key !== action.payload)
    }
  }
})

export const { setActiveKey, addTab, removeTab } = tabSlice.actions
export default tabSlice
