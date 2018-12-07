function buildName(firstName, lastName) {
    if (firstName === void 0) { firstName = 'Tom'; }
    return firstName + ' ' + lastName;
}
var tomcat = buildName('Tom', 'Cat');
var cat = buildName(undefined, 'Cat');
// document.addEventListener('click', function (e) {
//     // console.log(e.targetCurrent);
// });
function handleEvent(ele, event) {
    // do something
    return 1;
}
// handleEvent(document.getElementById('aa'), 'tap');
var xcatliu;
xcatliu = ['aa', 11, 'aa'];
var Days;
(function (Days) {
    Days[Days["Sun"] = 7] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
;
console.log(Days);
