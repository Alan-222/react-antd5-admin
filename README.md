### 前端服务

- 启动项目 npm run start
- 项目打包 npm run build
- 配置 npm run eject （此为一次性操作，不可撤回）

### 所需准备

#### 后端服务及接口文档

接下来要测试接口服务的话，这里就要用到之前给大家提供的 node 后端服务器

【[node 后端服务器](https://github.com/Alan-222/Vue3_Ts_NodeJs_management_system_server)】：

1.克隆到本地后新建 mysql 数据库并运行 sql 目录下的 database.sql 文件

2.修改 model 目录下 init.js 中的数据库信息

2.`npm install`安装依赖

3.`npm start`启动服务

【[Redis](https://github.com/tporadowski/redis/releases)】：用于验证码的缓存

1.点击链接并安装 msi 后缀的版本

2.设置默认端口 6379，密码 123456

【[接口文档](https://github.com/Alan-222/Vue3_Ts_NodeJs_management_system_server/blob/master/vue_ts-server/vue3%2Bts%2BnodeJS%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%EF%BC%88%E6%8E%A5%E5%8F%A3%E5%9C%B0%E5%9D%80%2B%E5%8F%82%E6%95%B0%EF%BC%89.md)】：提供了接口 url 信息及所需请求参数
