const path = require('path')
const { override, fixBabelImports, addWebpackAlias,disableEsLint,addLessLoader  } = require('customize-cra');
process.env.GENERATE_SOURCEMAP = false   // 打包时，去除SOURCEMAP映射
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  disableEsLint(),
  addWebpackAlias({
    "@components": path.resolve(__dirname, "./src/components"),
    "@pages": path.resolve(__dirname, "./src/pages"),
    "@utils": path.resolve(__dirname, "./src/utils"),
    "@assets": path.resolve(__dirname, "./src/assets")
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { "@primary-color": "#1DA57A" },
  }),
  config => {
    return config
  }
)