var events = require('events')
var eventEmitter = new events.EventEmitter()
eventEmitter.on('aa',(data)=>{
    console.log(data,'这是第二个监听')
})

eventEmitter.on('bb',(data)=>{
    console.log(data,'这是bb监听')
})
eventEmitter.on('aa',(data)=>{
    console.log(data,'这是第二个监听')
})

eventEmitter.addListener('aa',(data)=>{
    console.log(data,'这是第三个监听addListener')
})
eventEmitter.emit('aa','hahaha')



var eventListeners = eventEmitter.listenerCount('aa');
console.log(eventListeners + " 个监听器监听连接事件。");

eventEmitter.removeAllListeners()


var eventListeners = eventEmitter.listenerCount('aa');
console.log(eventListeners + " 个监听器监听连接事件。");

eventEmitter.emit('bb','ccc')
