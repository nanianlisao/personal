#!/bin/sh

#请配置如下打包信息

#项目中文昵称
projectChineseName="测试的"
#项目工程名字
projectName="test"

echo "请输入文件夹名称:\n"

read answer

mkdir $answer 

cd $answer 

type nul>$projectName.txt



echo "成功"

read -p "?是否还继续" website


