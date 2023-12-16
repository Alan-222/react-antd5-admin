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
      // sessionStorage.setItem('tabs', JSON.stringify(state.tabs))
    },
    // 删除tab
    removeTab: (state, action) => {
      state.tabs = state.tabs.filter((tab) => tab.key !== action.payload)
      // sessionStorage.setItem('tabs', JSON.stringify(state.tabs))
    }
  }
})

export const { addTab, removeTab } = tabSlice.actions
export default tabSlice
