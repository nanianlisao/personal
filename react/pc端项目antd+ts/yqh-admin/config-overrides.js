const path = require('path')
const { override, fixBabelImports, addWebpackAlias,disableEsLint } = require('customize-cra');
process.env.GENERATE_SOURCEMAP = false   // build时，去除SOURCEMAP映射
module.exports = override(
  // antd 的按需引入
  fixBabelImports('import', {  
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  disableEsLint(),
  // 设置alias ** 目前有问题，tsconfig 不支持
  addWebpackAlias({
    "@components": path.resolve(__dirname, "./src/components"),
    "@pages": path.resolve(__dirname, "./src/pages"),
    "@utils": path.resolve(__dirname, "./src/utils"),
    "@assets": path.resolve(__dirname, "./src/assets")
  }),
  config => {
    /**
     * 后续config有修改 可以在此处修改
     */
    return config
  }
)