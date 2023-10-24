import React, { useEffect } from 'react'
import userApi from '@/api/user'
const Home = () => {
  useEffect(() => {
    const fetchCode = async () => {
      const code = await userApi.login.get()
      console.log(code)
    }
    fetchCode()
  }, [])
  return <div>Home</div>
}
export default Home
