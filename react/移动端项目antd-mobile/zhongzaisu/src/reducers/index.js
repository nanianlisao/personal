import { combineReducers, createStore } from 'redux';
import baojia from './baojia.js';
import quanzi from './quanzi.js';
import homeList from './homeList.js';
import myBaojia from './myBaojia.js';
import comReceived from './comReceived.js';
import home from './home.js';


const appReducer = combineReducers({
    baojia, // 报价列表
    quanzi, // 圈子列表
    homeList, // 首页资讯列表
    myBaojia, // 我的报价列表
    comReceived,  // 我收到的列表
    home, // 我的页面
});



const store = createStore(appReducer)

export default store;


