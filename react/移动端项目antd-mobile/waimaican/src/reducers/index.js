import {combineReducers,createStore} from 'redux';
import myTicket from './myTicket.js';
import hisTicket from './hisTicket.js';
 
const appReducer = combineReducers({
    myTicket,
    hisTicket,
});



const store = createStore(appReducer)

export default store;


