const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir)
module.exports = {
  webpack: {
    alias: {
      '@': resolve('src')
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules[1].oneOf = [
        ...[
          {
            test: /.svg$/,
            // 存放svg的文件夹
            include: resolve('./src/assets/Icon/svg'),
            use: [
              { loader: 'svg-sprite-loader', options: {} },
              { loader: 'svgo-loader', options: {} }
            ]
          }
        ],
        ...webpackConfig.module.rules[1].oneOf
      ]
      return webpackConfig
    }
  }
}
