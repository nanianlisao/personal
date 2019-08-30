# 概述

 * 项目名称 **数说广告管理后台**
 
 * 创建人：**陈翔** - *c597219320@aliyun.com*
 
 * 创建时间：**july 31,2019 10:07**
 
 * 项目：数说广告管理（管理独立的webview）
 
 * 版权所有：**南京数说智能科技有限公司**
 
--------
# 主要模块

* *react@16.8.6*

* *react-router@^5.0.1*

* *axios@^0.19.0*

* *typescript@3.5.3*

* *antd^3.20.7*

----------

# 运行

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

--------

# 备注

webpack配置 由之前eject改为rewired。
线上服务器文件夹地址 adadmin.njshushuo.com

实现了以下基本功能：

1. 代码分割（路由懒加载） react.lazy + Suspense
2. 类型检查 typescript + tslint
3. antd按需引入 babel-plugin-import + react-app-rewired@2.x.x
4. 错误边界 代码内try catch 结合 最外层组件PotentialError componentDidCatch

以下功能因项目实际情况，未加入：

1. 状态管理 redux： 项目中公共state如登录信息等，均存放在localStorage中
2. 图片懒加载 react-lazyload: 该项目主要为后台页面，大部分数据为表格，内含图片较少。
