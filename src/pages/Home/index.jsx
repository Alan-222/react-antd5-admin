import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserinfo } from '@/store/reducers/userSlice'

const Home = () => {
  // 通过react-redux的useSelector钩子得到username
  const username = useSelector((state) => state.user.userinfo.username)
  // 分发action的钩子
  const dispatch = useDispatch()
  return (
    <div>
      <h2>Home</h2>
      <h2>Username:{username}</h2>
      <button onClick={() => dispatch(setUserinfo({ username: 'Tom' }))}>设置用户名为Tom</button>
    </div>
  )
}
export default Home
