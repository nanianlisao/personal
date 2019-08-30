import { combineReducers, createStore } from 'redux';
import order from './order.js';
import goods from './goods.js';
import category from './category.js';

const appReducer = combineReducers({
    order, // 订单列表
    goods,
    category, // 全部分类
});



const store = createStore(appReducer)

export default store;


