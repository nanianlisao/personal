const areaArr = [{ id: 108, name: "南京市", pid: 10 }, { id: 109, name: "无锡市", pid: 10 }, { id: 110, name: "徐州市", pid: 10 }, { id: 111, name: "常州市", pid: 10 }, { id: 112, name: "苏州市", pid: 10 }, { id: 113, name: "南通市", pid: 10 }, { id: 114, name: "连云港市", pid: 10 }, { id: 115, name: "淮安市", pid: 10 }, { id: 116, name: "盐城市", pid: 10 }, { id: 117, name: "扬州市", pid: 10 }, { id: 118, name: "镇江市", pid: 10 }, { id: 119, name: "泰州市", pid: 10 }, { id: 120, name: "宿迁市", pid: 10 }, { id: 1218, name: "宿城区", pid: 120 }, { id: 1219, name: "宿豫区", pid: 120 }, { id: 1220, name: "沭阳县", pid: 120 }, { id: 1221, name: "泗阳县", pid: 120 }, { id: 1222, name: "泗洪县", pid: 120 }, { id: 1212, name: "海陵区", pid: 119 }, { id: 1213, name: "高港区", pid: 119 }, { id: 1214, name: "兴化市", pid: 119 }, { id: 1215, name: "靖江市", pid: 119 }, { id: 1216, name: "泰兴市", pid: 119 }, { id: 1217, name: "姜堰市", pid: 119 }, { id: 1206, name: "京口区", pid: 118 }, { id: 1207, name: "润州区", pid: 118 }, { id: 1208, name: "丹徒区", pid: 118 }, { id: 1209, name: "丹阳市", pid: 118 }, { id: 1210, name: "扬中市", pid: 118 }, { id: 1211, name: "句容市", pid: 118 }, { id: 1199, name: "广陵区", pid: 117 }, { id: 1200, name: "邗江区", pid: 117 }, { id: 1201, name: "维扬区", pid: 117 }, { id: 1202, name: "宝应县", pid: 117 }, { id: 1203, name: "仪征市", pid: 117 }, { id: 1204, name: "高邮市", pid: 117 }, { id: 1205, name: "江都市", pid: 117 }, { id: 1190, name: "亭湖区", pid: 116 }, { id: 1191, name: "盐都区", pid: 116 }, { id: 1192, name: "响水县", pid: 116 }, { id: 1193, name: "滨海县", pid: 116 }, { id: 1194, name: "阜宁县", pid: 116 }, { id: 1195, name: "射阳县", pid: 116 }, { id: 1196, name: "建湖县", pid: 116 }, { id: 1197, name: "东台市", pid: 116 }, { id: 1198, name: "大丰市", pid: 116 }, { id: 1182, name: "清河区", pid: 115 }, { id: 1183, name: "楚州区", pid: 115 }, { id: 1184, name: "淮阴区", pid: 115 }, { id: 1185, name: "清浦区", pid: 115 }, { id: 1186, name: "涟水县", pid: 115 }, { id: 1187, name: "洪泽县", pid: 115 }, { id: 1188, name: "盱眙县", pid: 115 }, { id: 1189, name: "金湖县", pid: 115 }, { id: 1175, name: "连云区", pid: 114 }, { id: 1176, name: "新浦区", pid: 114 }, { id: 1177, name: "海州区", pid: 114 }, { id: 1178, name: "赣榆县", pid: 114 }, { id: 1179, name: "东海县", pid: 114 }, { id: 1180, name: "灌云县", pid: 114 }, { id: 1181, name: "灌南县", pid: 114 }, { id: 1167, name: "崇川区", pid: 113 }, { id: 1168, name: "港闸区", pid: 113 }, { id: 1169, name: "海安县", pid: 113 }, { id: 1170, name: "如东县", pid: 113 }, { id: 1171, name: "启东市", pid: 113 }, { id: 1172, name: "如皋市", pid: 113 }, { id: 1173, name: "通州市", pid: 113 }, { id: 1174, name: "海门市", pid: 113 }, { id: 1156, name: "沧浪区", pid: 112 }, { id: 1157, name: "平江区", pid: 112 }, { id: 1158, name: "金阊区", pid: 112 }, { id: 1159, name: "虎丘区", pid: 112 }, { id: 1160, name: "吴中区", pid: 112 }, { id: 1161, name: "相城区", pid: 112 }, { id: 1162, name: "常熟市", pid: 112 }, { id: 1163, name: "张家港市", pid: 112 }, { id: 1164, name: "昆山市", pid: 112 }, { id: 1165, name: "吴江市", pid: 112 }, { id: 1166, name: "太仓市", pid: 112 }, { id: 1149, name: "天宁区", pid: 111 }, { id: 1150, name: "钟楼区", pid: 111 }, { id: 1151, name: "戚墅堰区", pid: 111 }, { id: 1152, name: "新北区", pid: 111 }, { id: 1153, name: "武进区", pid: 111 }, { id: 1154, name: "溧阳市", pid: 111 }, { id: 1155, name: "金坛市", pid: 111 }, { id: 1138, name: "鼓楼区", pid: 110 }, { id: 1139, name: "云龙区", pid: 110 }, { id: 1140, name: "九里区", pid: 110 }, { id: 1141, name: "贾汪区", pid: 110 }, { id: 1142, name: "泉山区", pid: 110 }, { id: 1143, name: "丰县", pid: 110 }, { id: 1144, name: "沛县", pid: 110 }, { id: 1145, name: "铜山县", pid: 110 }, { id: 1146, name: "睢宁县", pid: 110 }, { id: 1147, name: "新沂市", pid: 110 }, { id: 1148, name: "邳州市", pid: 110 }, { id: 1130, name: "崇安区", pid: 109 }, { id: 1131, name: "南长区", pid: 109 }, { id: 1132, name: "北塘区", pid: 109 }, { id: 1133, name: "锡山区", pid: 109 }, { id: 1134, name: "惠山区", pid: 109 }, { id: 1135, name: "滨湖区", pid: 109 }, { id: 1136, name: "江阴市", pid: 109 }, { id: 1137, name: "宜兴市", pid: 109 }, { id: 1117, name: "玄武区", pid: 108 }, { id: 1119, name: "秦淮区", pid: 108 }, { id: 1120, name: "建邺区", pid: 108 }, { id: 1121, name: "鼓楼区", pid: 108 }, { id: 1123, name: "浦口区", pid: 108 }, { id: 1124, name: "栖霞区", pid: 108 }, { id: 1125, name: "雨花台区", pid: 108 }, { id: 1126, name: "江宁区", pid: 108 }, { id: 1127, name: "六合区", pid: 108 }, { id: 3254, name: "梁溪区", pid: 109 }, { id: 3253, name: "新吴区", pid: 109 }, { id: 1128, name: "溧水县", pid: 108 }, { id: 1129, name: "高淳县", pid: 108 }]
module.exports = { areaArr }