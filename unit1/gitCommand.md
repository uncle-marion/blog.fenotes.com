> 平安蜀黍的前端教程 > 备选知识点 > git 版本管理之常用命令

## git 快捷命令配置

快捷命令，也可以理解为对一些常用命令配置别名，要注意的是，这种方式可能会影响你对整个 git 命令的记忆，如下：

```shell
# mac 系统：
vi ~/.gitconifg

# windows 系统：
vim c:\\users\\你的用户名\\.gitconfig
# 如果没有vim可以使用记事本编辑
```

我个人常用全局配置项

```bash
[user]
  name = 平安蜀黍
  email = marion.lau.z@gmail.com
[alias]
  co = checkout                             # checkout， 切换分支
  st = status                               # status， 查看是否有新的更改
  ci = commit                               # commit， 将暂存区中的版本提交到本地库中
  br = branch                               # branch， 查看本地库分支情况
  ba = branch -a                            # branch -a， 查看远程库分支情况
  df = diff                                 # diff， 查看代码修改内容
  pr = pull --rebase                        # pull --rebase， 从远程库中同步并检查冲突情况
  acm = !git add . && git commit -m         # add && commit， 将本地所有更改发布到暂存区，然后提交到本地库中
  cox = !git checkout . && git clean -xdf   # checkout && clean -xdf， 放弃所有本地修改，返回到上一次commit之前的状态
  clg = reflog                              # reflog， 查看所有分支的所有操作记录，包括被删除的commit和reset操作
  rh = reset --hard HEAD^                   # 回退至上一个版本
  rs = reset --hard                         # 回退至指定版本号

  ls = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%Creset | %C(bold)%an' --abbrev-commit --date=relative
  lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
  last = log -1 HEAD
[http]
        postBuffer = 524288000
[https]
        postBuffer = 524288000
```

## git 命令及用法完整版

因为 VSCode 下的 Git 扩展功能越来越完善，你们可能会更喜欢使用 GitLens 或 GitGraph 来进行操作，下面这些命令，可能不会常用，大家可以保存一下，以备万一。当然，需要的时候找度娘也可以。

### 查看、添加、提交、删除、找回，重置修改文件

```shell
git help <command>                # 显示 command 的 help
git show                          # 显示某次提交的内容 git show $id
git co -- <file>                  # 抛弃工作区修改
git co .                          # 抛弃工作区修改
git add <file>                    # 将工作文件修改提交到本地暂存区
git add .                         # 将所有修改过的工作文件提交暂存区
git rm <file>                     # 从版本库中删除文件
git rm <file> --cached            # 从版本库中删除文件，但不删除文件
git reset <file>                  # 从暂存区恢复指定文件到工作文件
git reset -- .                    # 从暂存区恢复所有文件到工作文件
git reset --hard                  # 恢复最近一次提交过的状态，即放弃上次提交后的所有本次修改
git ci --amend                    # 修改最后一次提交记录
git revert <$id>                  # 恢复某次提交的状态，恢复动作本身也创建次提交对象
git revert HEAD                   # 恢复最后一次提交的状态
```

### 比较文件 diff

```shell
git diff <file>                   # 比较当前文件和暂存区文件差异 git diff
git diff <id1><id2>               # 比较两次提交之间的差异
git diff <branch1>..<branch2>     # 在两个分支之间比较
git diff --staged                 # 比较暂存区和版本库差异
git diff --cached                 # 比较暂存区和版本库差异
git diff --stat                   # 仅仅比较统计信息
```

### 查看提交记录

```shell
git log git log <file>            # 查看该文件每次提交记录
git log -p <file>                 # 查看每次详细修改内容的 diff
git log -p -2                     # 查看最近两次详细修改内容的 diff
git log --stat                    # 查看提交统计信息
```

### 查看、切换、创建和删除分支

```shell
git br -r                         # 查看远程分支
git br <new_branch>               # 创建新的分支
git br -v                         # 查看各个分支最后提交信息
git br --merged                   # 查看已经被合并到当前分支的分支
git br --no-merged                # 查看尚未被合并到当前分支的分支
git co <branch>                   # 切换到某个分支
git co -b <new_branch>            # 创建新的分支，并且切换过去
git co -b <new_branch> <branch>   # 基于 branch 创建新的 new_branch
git co $id                        # 把某次历史提交记录 checkout 出来，但无分支信息，切换到其他分支会自动删除
git co $id -b <new_branch>        # 把某次历史提交记录 checkout 出来，创建成一个分支
git br -d <branch>                # 删除某个分支
git br -D <branch>                # 强制删除某个分支 (未被合并的分支被删除的时候需要强制)
```

### 分支合并和 rebase

```shell
git merge <branch>                # 将 branch 分支合并到当前分支
git merge origin/master --no-ff   # 不要 Fast-Foward 合并，这样可以生成 merge 提交
git rebase master <branch>        # 将 master rebase 到 branch，相当于下面这行命令集：
git co <branch> && git rebase master && git co master && git merge <branch>
```

### 补丁管理(方便在多台机器上开发同步时用)

```shell
git diff > ../sync.patch          # 生成补丁
git apply ../sync.patch           # 打补丁
git apply --check ../sync.patch   # 测试补丁能否成功
```

### 暂存区管理

```shell
git stash                         # 暂存
git stash list                    # 列所有 stash
git stash apply                   # 恢复暂存的内容
git stash drop                    # 删除暂存区
```

### 远程分支管理

```shell
git pull                          # 抓取远程仓库所有分支更新并合并到本地
git pull --no-ff                  # 抓取远程仓库所有分支更新并合并到本地，不要快进合并
git fetch origin                  # 抓取远程仓库更新
git merge origin/master           # 将远程主分支合并到本地当前分支
git co --track origin/branch      # 跟踪某个远程分支创建相应的本地分支
git push                          # push 所有分支
git push origin master            # 将本地主分支推到远程主分支
git push -u origin master         # 将本地主分支推到远程(如无远程主分支则创建，用于初始化远程仓库)
git push origin <local_branch>    # 创建远程分支， origin 是远程仓库名
git push origin <local_branch>:<remote_branch>        # 创建远程分支
git push origin :<remote_branch>  # 先删除本地分支(git br -d <branch>)，然后再 push 删除远程分支
```

### 远程仓库管理

```shell
git remote -v                     # 查看远程服务器地址和仓库名称
git remote show origin            # 查看远程服务器仓库状态
git remote add origin git@ github:robbin/robbin_site.git          # 添加远程仓库地址
git remote set-url origin git@ github.com:robbin/robbin_site.git  # 设置远程仓库地址(用于修改远程仓库地址)
git remote rm <repository>        # 删除远程仓库
```

### 创建远程仓库

```shell
git clone --bare robbin_site robbin_site.git                      # 用带版本的项目创建纯版本仓库
scp -r my_project.git git@ git.csdn.net:~                         # 将纯仓库上传到服务器上
mkdir robbin_site.git && cd robbin_site.git && git --bare init    # 在服务器创建纯仓库
git remote add origin git@ github.com:robbin/robbin_site.git      # 设置远程仓库地址
git push -u origin master                                         # 客户端首次提交
git push -u origin develop                                        # 首次将本地 develop 分支提交到远程 develop 分支，并且 track
git remote set-head origin master                                 # 设置远程仓库的 HEAD 指向 master 分支
# 设置关联远程库和本地库
git branch --set-upstream master origin/master                    # 将远程仓库的master关联到本地库
git branch --set-upstream develop origin/develop                  # 将远程仓库的develop关联到本地库
```
