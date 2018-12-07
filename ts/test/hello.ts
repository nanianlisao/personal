function buildName(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let cat = buildName(undefined, 'Cat');
/// <reference path="">
declare var jQuery:(selector:string)=> any; //声明文件
document.addEventListener('click', function(e) {
    // console.log(e.targetCurrent);
});
type EventName = 'click' | 'scorll' | 'tap'; // 类型别名
function handleEvent(ele:Element,event:EventName):number{
    // do something
    return 1
}
handleEvent(document.getElementById('aa'),'tap')
let xcatliu: [string, number,string];
xcatliu = ['aa',11,'aa'];
enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};
console.log(Days)