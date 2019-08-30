/** @format */
import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import Router from './src/Router';
import {name as appName} from './app.json';
import BackgroundJob from 'react-native-background-job';
import Sound from 'react-native-sound';

let ws = null;

BackgroundJob.cancelAll();
//
// const backgroundJob = {
//     jobKey: "myJob",
//     job: () => {
//         if(ws){
//             ws.send("send webSocket");
//         }else{
//             console.log("create webSocket");
//             createWs()
//         }
//     }
// };
// const createWs = ()=>{
//     ws = new WebSocket("ws://192.168.1.81:8080/webSocket/shoppingcart/94eea79d3234c122268d2532c5924abd/5/000");
//     ws.onopen = () => {
//         console.log("open");
//     };
//     ws.onmessage = (e) => {
//         console.log(e.data);
//         let s = new Sound('http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&text=支付宝收款999元', null, (error) => {
//             if (error) {
//                 console.log('failed to load the sound', error);
//                 return;
//             }
//             s.play((success) => {
//                 if (success) {
//                     console.log('successfully finished playing');
//                 } else {
//                     console.log('playback failed due to audio decoding errors');
//                     s.reset();
//                 }
//             });
//         });
//     };
//     ws.onerror = (e) => {
//         console.log(e);
//     };
//     ws.onclose = (e) => {
//         ws = new WebSocket("ws://192.168.1.81:8080/webSocket/shoppingcart/94eea79d3234c122268d2532c5924abd/5/000");
//         console.log(e.code, e.reason);
//     };
// }
// BackgroundJob.register(backgroundJob);
//
// let backgroundSchedule = {
//     jobKey: "myJob",
//     period: 10000,
//     exact: true,                     //安排一个作业在提供的时间段内准确执行
//     allowWhileIdle: true,            //允许计划作业在睡眠模式下执行
//     allowExecutionInForeground: true,//允许任务在前台执行
// }
// BackgroundJob.schedule(backgroundSchedule);
export default class Index extends Component {
    render() {
        return (
            <Router />
        );
    }
}
AppRegistry.registerComponent(appName, () => Index);
