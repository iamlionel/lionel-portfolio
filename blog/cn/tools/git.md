---
title: "Git"
description: "全面总结 Git 分支、Rebase、Cherry-pick、回退操作、配置及 Stash 等核心用法，帮助你更好的掌握 Git"
date: "2021-04-08"
tags: ["Git", "工具", "版本控制"]
---

在日常开发中，Git 是我们不可或缺的版本控制工具。本文将之前的多篇 Git 学习笔记进行了深度整合，涵盖了 **配置中心**、**分支操作**、**Rebase**、**Cherry-pick**、**回退操作** 以及 **Stash** 等核心部分，方便日常查询与复习。

## 1. Git 配置 {#git-config}

**配置级别与优先级：**

1. **local**：项目级配置，在项目当前目录下配置。
2. **global**：用户级配置，在 home 目录 `.gitconfig` 文件。
3. **system**: 系统级配置，`/etc` 目录下。

> 优先级依次是: `local` > `global` > `system`。

### 1.1 设置用户名

```bash
# 语法：git config --global <configname> <configvalue>
git config --global user.name "lionel"
git config --global user.email "xxxxx@xxxxx.com"
git config --global --list # 查看用户级的所有配置
```

### 1.2 设置 SSH Key

```bash
ssh-keygen -t rsa -C "xxxxx@xxxxx.com"
```

### 1.3 设置好用的别名 (Alias)

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.pl "pull --rebase"
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %C(bold blue)%s%Creset %Cgreen(%cr) <%an>%Creset' --abbrev-commit --date=relative"
git config --global alias.lga "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %C(bold blue)%s%Creset %Cgreen(%cr) <%an>%Creset' --abbrev-commit --date=relative --author xujun"
git config --global alias.last "log -1"
```

## 2. Git 分支的理解 {#git-branch-concept}

1. `HEAD` 指向的是当前分支；`master` 指向的是提交：
   ![](/assets/img/git/branch-1.png)
   ![](/assets/img/git/branch-2.png)
2. 当新建一个分支 `dev` 时，只是新建了一个指向提交的指针：
   ![](/assets/img/git/branch-3.png)
3. 当 `dev` 分支做了一个新的提交：
   ![](/assets/img/git/branch-4.png)
4. 将 `dev` 合并到 `master` 上时，只需要将 `master` 指向 `dev` 新的提交，这就是 **FastForward**：
   ![](/assets/img/git/branch-5.png)
   默认是使用 FastForward 模式，如果不使用就会产生一个新的提交：
   ```bash
   git merge --no-ff dev # 不使用 FastForward
   ```
   ![](/assets/img/git/branch-6.png)
5. `master` 和 `dev` 都同时有了提交，且发生冲突时：
   ![](/assets/img/git/branch-7.png)

## 3. Git 分支操作 {#git-branch-operation}

```bash
# 新建 dev 分支 (注意如果加 -b 是创建并切换)
git branch dev
# 切换到 dev 分支
git checkout dev

# 查看远程仓库地址
git remote -v
# 查看本地、远程、所有分支
git branch
git branch -r
git branch -a
# 查看分支对应关系
git branch -vv

# 将本地分支关联到远程地址
git remote add origin "address"

# 拉取远程分支
git pull
git fetch + git merge
# 说明：在当前分支执行 git pull，其他分支会执行 git fetch，但是不会 merge，只有当前分支会 merge。

# 将本地分支 dev 推送到远程 master
git push origin dev:master
# 将本地分支 dev 推送到远程 master 并建立关联
git push -u origin dev:master
# 将当前分支和远程 dev 分支解除关联
git branch --unset-upstream dev
# 修改当前分支关联的远程分支改为 master（和上面一条命令一样效果）
git branch -u origin/master

# 删除本地 dev 分支
git branch -d dev
# 删除远程 dev 分支
git push origin :dev
git push origin --delete dev

# 拉取远程 dev 分支到本地
git checkout dev

# 一次推送所有分支
git push --all origin
```

## 4. Git rebase {#git-rebase}

**变基操作**：可以对某一段线性提交历史进行编辑、删除、复制、粘贴；因此，合理使用 rebase 命令可以使我们的提交历史干净、简洁！

> **[前提/警告]** 不要通过 rebase 对任何已经提交到公共仓库中的 commit 进行修改（你自己一个人玩的分支除外），否则会引起严重的提交历史冲突。

## 5. Git cherry-pick {#git-cherry-pick}

1. `cherry-pick` 的作用是将某个提交转移到另一个分支：
   ![](/assets/img/git/cherry-pick-1.png)
2. 转移多个提交：
   ![](/assets/img/git/cherry-pick-2.png)
3. 常用参数：
   ![](/assets/img/git/cherry-pick-3.png)
4. 冲突解决：
   ![](/assets/img/git/cherry-pick-4.png)

## 6. Git 回退操作 {#git-rollback}

### 6.1 restore 命令

| 命令                                | 作用                                          | 备注            |
| ----------------------------------- | --------------------------------------------- | --------------- |
| `git restore --worktree README.md`  | 撤销 README.md 文件工作区的修改               | 参数等同于 `-W` |
| `git restore --staged README.md`    | 撤销暂存区的修改，将文件状态恢复到未 add 之前 | 参数等同于 `-S` |
| `git restore -s HEAD~1 README.md`   | 将当前工作区切换到上个 commit 版本            |                 |
| `git restore -s commitId README.md` | 将当前工作区切换到指定 commit id 的版本       |                 |

### 6.2 reset 命令

| 命令                             | 作用                                        | 备注                               |
| -------------------------------- | ------------------------------------------- | ---------------------------------- |
| `git reset --soft HEAD^ [file]`  | 回退所有内容到上一个版本,并把差异放进暂存区 | 可以单独还原某个文件               |
| `git reset --mixed HEAD^ [file]` | 回退所有内容到上一个版本,并把差异放进工作区 | 可以单独还原某个文件               |
| `git reset --hard HEAD^`         | 回退所有内容到上一个版本,不保留任何差异     | 只能全部还原，不能单独还原某个文件 |
| `git reset HEAD^`                | 等同与 `git reset --mixed HEAD^`            |                                    |

### 6.3 revert 和 reset 的区别

![](/assets/img/git/revert-1.png)
![](/assets/img/git/revert-2.png)

```bash
git revert -n <版本2-commitid>
```

### 6.4 checkout 撤销修改

```bash
# 撤销工作区中 file 的修改
git checkout -- file
```

### 6.5 撤销远程版本库的修改

```bash
# 先用 reset 命令将本地版本库还原到指定版本
git reset HEAD^
# 再强制提交
git push -f
```

### 6.6 git rm 和 rm

- `git rm` 删除一个文件，并将被删除的文件纳入暂存区，相当于 `rm file`，然后再 `git add file`。

**git rm 与 git rm --cached 的区别：**

```bash
# 当我们需要删除暂存区或分支上的文件, 同时工作区也不需要这个文件了, 可以使用：
git rm file_path
git commit -m 'delete somefile'
git push

# 当我们需要删除暂存区或分支上的文件, 但本地又需要使用, 只是不希望这个文件被版本控制, 可以使用：
git rm --cached file_path
git commit -m 'delete remote somefile'
git push
```

### 6.7 修改上一次的提交

```bash
git commit --amend
```

### 6.8 还原撤销操作

通过 `git reflog` 查看操作日志，然后通过 `git reset` 还原到指定的 `commit_id`：

```bash
git reflog
git reset --hard <commit_id>
```

### 6.9 常用回退操作小结：

- **将暂存区的修改还原到工作区：**
  1. `git restore --staged file`
  2. `git reset HEAD file`
- **将工作区的修改还原：**
  1. `git restore file`
  2. `git checkout -- file`
  3. `git reset --hard` (不能指定文件，只能还原工作区所有修改)
- **将版本库中的修改还原到暂存区：**
  - `git reset --soft HEAD^` 还原到上一个版本
- **将版本库中的修改还原到工作区：**
  - `git reset --mixed HEAD^`
- **将版本库回退到上一个版本，并不保留所有差异：**
  - `git reset --hard HEAD^`

## 7. Git Stash {#git-stash}

![](/assets/img/git/stash-1.png)

**临时存储未追踪的新文件 `% git stash -u`**
在开发过程中新添加的文件不属于任何一个分支，在不冲突的文件情况下也可以在切换分支的时候带到新的分支。默认在使用 `git stash` 命令的时候不会把这些文件临时存起来，如果想要存起来，加上 `-u` 参数就可以了，执行之后你会发现这个新加的文件在工作区中消失了。

**临时存储被忽略的文件 `% git stash -a`**
被忽略的文件在默认情况下也不会被 `git stash` 命令存储，想要临时存储这部分文件只要使用 `-a` 参数就可以了，这样不仅会把忽略的文件临时存储，连未追踪的文件也存储了起来。

**利用临时存储的修改内容新建分支 `% git stash branch <branchname> [<stash>]`**
一般这种情况就是使用过多次 `git stash push` 命令，而本地分支还修改了其他内容，直接恢复之前的修改不太合适，所以利用这个命令新建一个分支。分支的内容以指定的存储标号 `<stash>` 对应的提交 `commit-id` 为基础，然后应用 `<stash>` 的修改，实际上就是新建了一个对应 `<stash>` 的分支，继续之前未完成的工作，`<stash>` 默认为 `stash@{0}`。
