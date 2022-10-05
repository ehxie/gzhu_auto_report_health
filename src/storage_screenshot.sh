#!/bin/bash
git config --local user.email "$github_email"
git config --local user.name "$github_name"


# 将截图复制到新目录下
date=`date +%Y_%m_%d-%H_%M_%S`
if [ ! -d "log" ]; then
    mkdir log
fi
cp -r screenshot/* log/

echo "git status -s"
git status -s
echo "\n"

git stash

# 切换分支
git pull -a # 确保下面判断正确
if [ `git branch -r | grep $branch_name` ]
then
    echo "Branch named $branch_name already exists"
    git checkout $branch_name
else
    echo "Branch named $branch_name does not exist"
    git checkout -b $branch_name
    git push --set-upstream origin $branch_name
fi

echo "branch: $branch_name"
git pull -r
git log

git stash pop

# 删除七天前文件
v_date_ago_7=`date -d "$v_date -7 day" +%Y_%m_%d*`
echo "删除七天前文件：$v_date_ago_7"
rm -r log/$v_date_ago_7

git status -s

cd log
ls

git add .

git commit -m "feat: $date screenshot"

if test "$(git rev-parse --abbrev-ref HEAD)" != main; then
    echo "not main"
    git push
fi

# sleep 10000