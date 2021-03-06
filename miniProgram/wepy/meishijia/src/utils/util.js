const Promise = require('./bluebird');
const isDebug = true;

/**
 * 功能描述：时间格式化
 * @param  fmt 格式化字符串 默认值 yyyy-MM-dd HH:mm:ss
 * @return 格式化后的字符互串
 * 例子：
 * var time1 = new Date().Format();
 * var time2 = new Date().Format("yyyy-MM-dd");
 * var time3 = new Date().Format("yyyy-MM-dd HH:mm:ss");
 */
Date.prototype.Format = function(fmt = "yyyy-MM-dd hh:mm:ss") { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function strTojson(str) {
  return typeof str == 'string' ? JSON.parse(str.replace(/\\"/g, "\"").replace(/'/g, '\"').replace(/，/g, ',')) : str
}

/**
 * 功能描述 屏蔽一些常用敏感词
 * 
 */

function hasSensitiveWords(str) {
  if (str == '' || str == undefined) return false;
  var words = '第一代领导,第二代领导,第三代领导,第四代领导,第五代领导,第六代领导,第七代领导,第1代领导,第2代领导,第3代领导,第4代领导,第5代领导,第6代领导,第7代领导,一位老同志的谈话,国办发,中办发,腐败中国,三个呆婊,你办事我放心,社会主义灭亡,打倒中国,灭亡中国,亡党亡国,粉碎四人帮,激流中国,特供,特贡,特共,zf大楼,殃视,贪污腐败,强制拆除,形式主义,政治风波,太子党,上海帮,北京帮,清华帮,红色贵族,权贵集团,河蟹社会,喝血社会,九风,9风,十七大,十7大,17da,九学,9学,四风,4风,双规,南街村,最淫官员,警匪,官匪,独夫民贼,官商勾结,城管暴力执法,强制捐款,毒豺,一党执政,一党专制,一党专政,专制政权,宪法法院,苏晓康,贺卫方,谭作人,焦国标,万润南,张志新,辛灝年,高勤荣,王炳章,高智晟,司马璐,刘晓竹,刘宾雁,魏京生,寻找林昭的灵魂,别梦成灰,谁是新中国,讨伐中宣部,异议人士,民运人士,启蒙派,选国家主席,民一主,min主,民竹,民珠,民猪,chinesedemocracy,大赦国际,国际特赦,da选,投公,公头,宪政,平反,党章,维权,昝爱宗,宪章,08宪,08xz,觉醒的中国公民日渐清楚地认识到,抿主,民主,敏主,人拳,人木又,人quan,renquan,中国人权,中国的人权,中国新民党,群体事件,群体性事件,上中央,去中央,讨说法,请愿,请命,公开信,联名上书,万人大签名,万人骚动,截访,上访,shangfang,信访,访民,集会,静坐,静zuo,jing坐,示威,示wei,游行,you行,油行,游xing,youxing,官逼民反,反party,反共,抗议,亢议,低制,底制,di制,抵zhi,dizhi,boycott,血书,焚烧中国国旗,baoluan,流血冲突,出现暴动,发生暴动,引起暴动,baodong,灭共,杀毙,罢工,霸工,罢考,罢餐,霸餐,罢参,罢饭,罢吃,罢食,罢课,罢ke,霸课,ba课,罢教,罢学,罢运,网特,网评员,网络评论员,五毛党,五毛们,5毛党,戒严,jieyan,jie严,戒yan,8的平方事件,知道64,八九年,贰拾年,2o年,20和谐年,贰拾周年,六四,六河蟹四,六百度四,六和谐四,陆四,陆肆,198964,5月35,89年春夏之交,64惨案,64时期,64运动,4事件,四事件,北京风波,学潮,学chao,xuechao,学百度潮,门安天,天按门,坦克压大学生,民主女神,历史的伤口,高自联,北高联,维多利亚公园,thegateofheavenlypeace,bloodisonthesquare,为了忘却的纪念,血洗京城,四二六社论,王丹,柴玲,封从德,王超华,王维林,吾尔开希,吾尔开西,侯德健,阎明复,方励之,蒋捷连,丁子霖,辛灏年,蒋彦永,严家其,陈一咨,中华局域网,党的喉舌,互联网审查,当局严密封锁,新闻封锁,封锁消息,爱国者同盟,关闭所有论坛,网络封锁,金盾工程,gfw,无界浏览,无界网络,自由门,何清涟,中国的陷阱,汪兆钧,记者无疆界,境外媒体,世界日报,东森新闻网,东森电视,基督教科学箴言报,星岛日报,中央社,雅虎香港,youtube,googleblogger,美国之音,自由亚洲,中央日报,自由时报,中国时报,反分裂,威胁论,左翼联盟,钓鱼岛,保钓组织,主权,弓单,火乍,木仓,石肖,核蛋,步qiang,bao炸,爆zha,baozha,zha药,zha弹,炸dan,炸yao,zhadan,zhayao,hmtd,三硝基甲苯,六氟化铀,炸药配方,弹药配方,炸弹配方,皮箱炸弹,火药配方,人体炸弹,人肉炸弹,解放军,兵力部署,军转,军事社,8341部队,第21集团军,七大军区,7大军区,北京军区,沈阳军区,济南军区,成都军区,广州军区,南京军区,兰州军区,颜色革命,规模冲突,塔利班,基地组织,恐怖分子,恐怖份子,三股势力,印尼屠华,印尼事件,蒋公纪念歌,马英九,mayingjiu,李天羽,苏贞昌,林文漪,陈水扁,陈s扁,陈随便,阿扁,a扁,告全国同胞书,台百度湾,台完,台wan,taiwan,台弯,湾台,台湾国,台湾共和国,台军,台独,台毒,台du,taidu,twdl,一中一台,打台湾,两岸关系,两岸战争,攻占台湾,支持台湾,进攻台湾,占领台湾,统一台湾,收复台湾,登陆台湾,解放台湾,解放tw,解决台湾,光复民国,台湾独立,台湾问题,台海问题,台海危机,台海统一,台海大战,台海战争,台海局势,入联,入耳关,中华联邦,国民党,x民党,民进党,青天白日,闹独立,duli,fenlie,日本万岁,小泽一郎,劣等民族,汉人,汉维,维汉,维吾,吾尔,热比娅,伊力哈木,疆独,东突厥斯坦解放组织,东突解放组织,蒙古分裂分子,列确,阿旺晋美,藏人,臧人,zang人,藏民,藏m,达赖,赖达,dalai,哒赖,dl喇嘛,丹增嘉措,打砸抢,西独,藏独,葬独,臧独,藏毒,藏du,zangdu,支持zd,藏暴乱,藏青会,雪山狮子旗,啦萨,啦沙,啦撒,拉sa,lasa,la萨,藏西,xizang,xi藏,x藏,西z,tibet,希葬,希藏,硒藏,稀藏,西脏,西奘,西葬,西臧,援藏,bjork,王千源,安拉,回教,回回,回民,穆斯林,穆罕穆德,穆罕默德,默罕默德,伊斯兰,圣战组织,清真,清zhen,qingzhen,真主,高丽棒子,韩国狗,满洲第三帝国,满狗,鞑子,胡的接班人,钦定接班人,习近平,习大大,平近习,xjp,习太子,习明泽,老习,温家宝,温加宝,温x,温jia宝,温宝宝,温加饱,温加保,张培莉,温云松,温如春,温jb,胡温,胡x,胡jt,胡boss,胡总,胡王八,hujintao,胡jintao,胡j涛,胡惊涛,胡景涛,胡紧掏,湖紧掏,胡紧套,锦涛,hjt,胡派,胡主席,刘永清,胡海峰,胡海清,江泽民,民泽江,江胡,江哥,江主席,江书记,江浙闽,江沢民,江浙民,择民,则民,茳泽民,zemin,ze民,老江,老j,江core,江x,江派,江zm,jzm,江戏子,江蛤蟆,江某某,江贼,江猪,江氏集团,江绵恒,江绵康,王冶坪,江泽慧,邓小平,平小邓,xiao平,邓xp,邓晓平,邓朴方,邓榕,邓质方,毛泽东,猫泽东,猫则东,chairmanmao,猫贼洞,毛zd,毛zx,z东,ze东,泽d,zedong,毛太祖,毛相,主席画像,改革历程,朱镕基,朱容基,朱镕鸡,朱容鸡,朱云来,李鹏,李peng,里鹏,李月月鸟,李小鹏,李小琳,华主席,华国,国锋,国峰,锋同志,白春礼,薄熙来,薄一波,蔡赴朝,蔡武,曹刚川,常万全,陈炳德,陈德铭,陈建国,陈良宇,陈绍基,陈同海,陈至立,戴秉国,丁一平,董建华,杜德印,杜世成,傅锐,郭伯雄,郭金龙,贺国强,胡春华,耀邦,华建敏,黄华华,黄丽满,黄兴国,回良玉,贾庆林,贾廷安,靖志远,李长春,李春城,李建国,李克强,李岚清,李沛瑶,李荣融,李瑞环,李铁映,李先念,李学举,李源潮,栗智,梁光烈,廖锡龙,林树森,林炎志,林左鸣,令计划,柳斌杰,刘奇葆,刘少奇,刘延东,刘云山,刘志军,龙新民,路甬祥,罗箭,吕祖善,马飚,马恺,孟建柱,欧广源,强卫,沈跃跃,宋平顺,粟戎生,苏树林,孙家正,铁凝,屠光绍,王东明,汪东兴,王鸿举,王沪宁,王乐泉,王洛林,王岐山,王胜俊,王太华,王学军,王兆国,王振华,吴邦国,吴定富,吴官正,无官正,吴胜利,吴仪,奚国华,习仲勋,徐才厚,许其亮,徐绍史,杨洁篪,叶剑英,由喜贵,于幼军,俞正声,袁纯清,曾培炎,曾庆红,曾宪梓,曾荫权,张德江,张定发,张高丽,张立昌,张荣坤,张志国,赵洪祝,周生贤,周永康,朱海仑,政治局常委,中纪委,主席像,总书记,中南海,大陆当局,中国当局,北京当局,共产党,党产共,gcd,共贪党,gongchandang,阿共,共一产一党,产党共,公产党,工产党,共c党,共x党,共铲,供产,共惨,供铲党,供铲谠,供铲裆,共残党,共残主义,共产主义的幽灵,拱铲,老共,中共,中珙,中gong,gc党,贡挡,gong党,g产,狗产蛋,共残裆,恶党,邪党,共产专制,共产王朝,裆中央,土共,土g,共狗,g匪,共匪,仇共,communistparty,政府,症腐,政腐,政付,正府,政俯,政一府,政百度府,政f,zhengfu,政zhi,挡中央,档中央,中央领导,中国zf,中央zf,国wu院,中华帝国,gong和,大陆官方,北京政权,,福音会,中国教徒,统一教,观音法门,清海无上师,李洪志,志洪李,李宏志,轮功,法轮,轮法功,三去车仑,氵去车仑,发论工,法x功,法o功,法0功,法一轮一功,轮子功,车仑工力,法lun,fa轮,法lg,flg,fl功,falungong,大法弟子,大纪元,dajiyuan,明慧网,明慧周报,正见网,新唐人,伪火,退党,tuidang,退dang,超越红墙,自fen,真善忍,九评,9评,9ping,九ping,jiuping,藏字石,集体自杀,自sha,zi杀,suicide,titor,逢8必灾,逢八必灾,逢9必乱,逢九必乱,朱瑟里诺,根达亚文明,诺查丹玛斯,人类灭亡进程表,按照马雅历法,推背图,推bei图,济世灵文,诸世纪,爱女人,爱液,按摩棒,拔出来,爆草,包二奶,暴干,暴奸,暴乳,爆乳,暴淫,屄,被操,被插,被干,逼奸,仓井空,插暴,操逼,操黑,操烂,肏你,肏死,操死,操我,厕奴,插比,插b,插逼,插进,插你,插我,插阴,潮吹,潮喷,成人电影,成人论坛,成人色情,成人网站,成人文学,成人小说,艳情小说,成人游戏,吃精,赤裸,抽插,扌由插,抽一插,春药,大波,大力抽送,大乳,荡妇,荡女,盗撮,多人轮,发浪,放尿,肥逼,粉穴,封面女郎,风月大陆,干死你,干穴,肛交,肛门,龟头,裹本,国产av,好嫩,豪乳,黑逼,后庭,后穴,虎骑,花花公子,换妻俱乐部,黄片,几吧,鸡吧,鸡巴,鸡奸,寂寞男,寂寞女,妓女,激情,集体淫,奸情,叫床,脚交,金鳞岂是池中物,金麟岂是池中物,精液,就去日,巨屌,菊花洞,菊门,巨奶,巨乳,菊穴,开苞,口爆,口活,口交,口射,口淫,裤袜,狂操,狂插,浪逼,浪妇,浪叫,浪女,狼友,聊性,流淫,铃木麻,凌辱,漏乳,露b,乱交,乱伦,轮暴,轮操,轮奸,裸陪,买春,美逼,美少妇,美乳,美腿,美穴,美幼,秘唇,迷奸,密穴,蜜穴,蜜液,摸奶,摸胸,母奸,奈美,奶子,男奴,内射,嫩逼,嫩女,嫩穴,捏弄,女优,炮友,砲友,喷精,屁眼,品香堂,前凸后翘,强jian,强暴,强奸处女,情趣用品,情色,拳交,全裸,群交,惹火身材,人妻,人兽,日逼,日烂,肉棒,肉逼,肉唇,肉洞,肉缝,肉棍,肉茎,肉具,揉乳,肉穴,肉欲,乳爆,乳房,乳沟,乳交,乳头,三级片,骚逼,骚比,骚女,骚水,骚穴,色逼,色界,色猫,色盟,色情网站,色区,色色,色诱,色欲,色b,少年阿宾,少修正,射爽,射颜,食精,释欲,兽奸,兽交,手淫,兽欲,熟妇,熟母,熟女,爽片,爽死我了,双臀,死逼,丝袜,丝诱,松岛枫,酥痒,汤加丽,套弄,体奸,体位,舔脚,舔阴,调教,偷欢,偷拍,推油,脱内裤,文做,我就色,无码,舞女,无修正,吸精,夏川纯,相奸,小逼,校鸡,小穴,小xue,写真,性感妖娆,性感诱惑,性虎,性饥渴,性技巧,性交,性奴,性虐,性息,性欲,胸推,穴口,学生妹,穴图,亚情,颜射,阳具,要射了,夜勤病栋,一本道,一夜欢,一夜情,一ye情,阴部,淫虫,阴唇,淫荡,阴道,淫电影,阴阜,淫妇,淫河,阴核,阴户,淫贱,淫叫,淫教师,阴茎,阴精,淫浪,淫媚,淫糜,淫魔,淫母,淫女,淫虐,淫妻,淫情,淫色,淫声浪语,淫兽学园,淫书,淫术炼金士,淫水,淫娃,淫威,淫亵,淫样,淫液,淫照,阴b,应召,幼交,幼男,幼女,欲火,欲女,玉女心经,玉蒲团,玉乳,欲仙欲死,玉穴,援交,原味内衣,援助交际,张筱雨,招鸡,招妓,中年美妇,抓胸,自慰,作爱,18禁,99bb,a4u,a4y,adult,amateur,anal,a片,fuck,gay片,g点,g片,hardcore,h动画,h动漫,incest,porn,secom,sexinsex,sm女王,xiao77,xing伴侣,tokyohot,yin荡,汉芯造假,杨树宽,中印边界谈判结果,喂奶门,摸nai门,酒瓶门,脱裤门,75事件,新疆骚乱,针刺,打针,食堂涨价,饭菜涨价,h1n1,瘟疫爆发,yangjia,y佳,yang佳,杨j,袭警,杀警,武侯祠,川b26931,贺立旗,周正毅,px项目,骂四川,家l福,家le福,加了服,麦当劳被砸,豆腐渣,这不是天灾,龙小霞,震其国土,yuce,提前预测,地震预测,隐瞒地震,李四光预测,蟾蜍迁徙,地震来得更猛烈,八级地震毫无预报,踩踏事故,聂树斌,万里大造林,陈相贵,张丹红,尹方明,李树菲,王奉友,零八奥运艰,惨奥,奥晕,凹晕,懊运,懊孕,奥孕,奥你妈的运,反奥,628事件,weng安,wengan,翁安,瓮安事件,化工厂爆炸,讨回工资';
  var array = words.split(','),
    len = array.length;
  for (var i = 0; i < len; i++) {
    var item = array[i];
    if (str.indexOf(item) >= 0 && item != '') {
      return item;
    }
  }
  return false;
}


/**
 * 功能描述：异步操作，因为微信的所有api接口都是异步回调操作很多地方需要同步，
 *          避免异步嵌套问题，所有提取出这统一的接口,使用的是es6的语法
 * 
 * @param fn 微信api同步的函数名，如：wx.getStorage
 * @return 返回一个Promise，es6的语法规定
 * 
 * 例子：两种方法
 * 
 * 1、匿名函数
 * （async function(that){
 *      const fn = util.asyncFunction(wx.getStorage);
 *      var data = {};//参数
 *      var res = await fn(data);
 *       util.debug(data);
 *     }）（this）；//这个this
 * 2、函数
 * function async test (){
 *      const fn = util.asyncFunction(wx.getStorage);
 *      var data = {};//参数
 *      var res = await fn(data);
 *      util.debug(data);
 * }
 */
function asyncFunction(fn) {
  return function(data = {}) {
    return new Promise(function(resolve, reject) {
      data.success = res => resolve(res);
      data.fail = res => reject(res);
      fn(data);
    });
  }
}

function debug(o) {
  if (isDebug) {}
}

function tip(str) {
  wx.showToast({
    title: str,
    icon: 'none'
  })
}


/**
 *  功能描述：深度克隆对象
 *  @param obj 被克隆的对象
 *  @return 新对象
 * 
 */
function deepClone(obj) {
  var result;
  var oClass = isClass(obj);
  if (oClass === "Object") {
    result = {};
  } else if (oClass === "Array") {
    result = [];
  } else {
    return obj;
  }
  for (var key in obj) {
    var copy = obj[key];
    if (isClass(copy) == "Object") {
      result[key] = arguments.callee(copy); //递归调用
    } else if (isClass(copy) == "Array") {
      result[key] = arguments.callee(copy);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

/*
 *
 * 功能描述：判断对象的数据类型
 * @param o  对象
 */
function isClass(o) {
  if (o === null) return "Null";
  if (o === undefined) return "Undefined";
  return Object.prototype.toString.call(o).slice(8, -1);
}

/**
 * 功能描述：同步网络Get请求，因为经常会用到同步网络请求，所有单独封装出来
 * @param url 请求的URL
 * @param data 请求的数据
 * @return 返回网络请求的数据
 * 
 * 例子：和上面的asyncFunction一样有两种写，匿名函数和函数
 * （function(){
 *    var data = {}
 *    var res = await util.wx_requestGet(url,data);
 *    console.log(res);
 *  }）（this）；
 *  
 * 
 */
function wx_requestGet(url, data = {}) {
  return _request(wx.request, url, "GET", data);
}


/**
 * 功能描述：同步网络Post请求，因为经常会用到同步网络请求，所有单独封装出来
 * @param url 请求的URL
 * @param data 请求的数据
 * @return 返回网络请求的数据
 * 
 * 例子：和上面的asyncFunction一样有两种写，匿名函数和函数
 * （function(){
 *    var data = {}
 *    var res = await util.wx_requestPost(url,data);
 *    console.log(res);
 *  }）（this）；
 *  
 * 
 */
function wx_requestPost(url, data = {}) {
  data.header = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  };
  return _request(wx.request, url, "POST", data);
}

function _request(fn, url, method, data) {
  return new Promise(function(resolve, reject) {
    data.url = url;
    data.method = method;
    data.success = res => resolve(res);
    data.fail = res => reject(res);
    fn(data);
  });
}

// textarea 转 view
function textareaToView(target) {
  let that = target;
  that.bindBlurTextarea = bindBlurTextarea.bind(that);
  that.tapView = tapView.bind(that);
}
/*textarea失去焦点 */
function bindBlurTextarea(e) {
  let { name } = e.currentTarget.dataset;
  this.setData({
    [name]: false
  })
}
/*点击view 显示出textarea */
function tapView(e) {
  let { name } = e.currentTarget.dataset;
  this.setData({
    [name]: true
  })
}


/**
 *  已经废弃
 *  功能描述： 因为页面有很多图片是jSON格式的字符串形式，需要转换，转换
 */
function buildImgContent(banners) {
  for (var i = 0; i < banners.length; i++) {
    try {
      banners[i].content = JSON.parse(banners[i].content);
    } catch (e) { continue; }
  }
}


/**
 * 功能描述： es6转换es5用到的函数
 */
function _asyncToGenerator(fn) { return function() { var gen = fn.apply(this, arguments); return new Promise(function(resolve, reject) {
      function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function(value) { step("next", value); }, function(err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = {
  wx_requestGet,
  wx_requestPost,
  _asyncToGenerator,
  asyncFunction,
  buildImgContent,
  strTojson,
  debug,
  deepClone,
  hasSensitiveWords,
  textareaToView,
  tip
};
