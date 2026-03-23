---
title: "Git"
description: "A comprehensive summary of core Git usages, including Branching, Rebase, Cherry-pick, Rollback, Configuration, and Stash."
date: "2021-04-08"
tags: ["Git", "Tools", "Version Control"]
---

In daily development, Git is an indispensable version control tool. This article deeply integrates several Git study notes into a comprehensive guide, covering **Configuration**, **Branch Operations**, **Rebase**, **Cherry-pick**, **Rollbacks**, and **Stash**.

## 1. Git Configuration {#git-config}

**Configuration Levels & Priorities:**

1. **local**: Project-level configuration, configured in the current project directory.
2. **global**: User-level configuration, found in the `.gitconfig` file in the home directory.
3. **system**: System-level configuration, located in the `/etc` directory.

> Priority sequence: `local` > `global` > `system`.

### 1.1 Setting Username

```bash
# Syntax: git config --global <configname> <configvalue>
git config --global user.name "lionel"
git config --global user.email "xxxxx@xxxxx.com"
git config --global --list # View all user-level configs
```

### 1.2 Setting SSH Key

```bash
ssh-keygen -t rsa -C "xxxxx@xxxxx.com"
```

### 1.3 Useful Aliases

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

## 2. Understanding Git Branches {#git-branch-concept}

1. `HEAD` points to the current branch; `master` points to the commit:
   ![](/assets/img/git/branch-1.png)
   ![](/assets/img/git/branch-2.png)
2. When creating a new branch `dev`, it simply creates a pointer to the commit:
   ![](/assets/img/git/branch-3.png)
3. When the `dev` branch makes a new commit:
   ![](/assets/img/git/branch-4.png)
4. When merging `dev` into `master`, it shifts the `master` pointer to `dev`'s new commit, known as a **FastForward**:
   ![](/assets/img/git/branch-5.png)
   FastForward mode is used by default. If not used, a new commit will be generated:
   ```bash
   git merge --no-ff dev # Do not use FastForward
   ```
   ![](/assets/img/git/branch-6.png)
5. When `master` and `dev` both have new commits concurrently and a conflict occurs:
   ![](/assets/img/git/branch-7.png)

## 3. Git Branch Operations {#git-branch-operation}

```bash
# Create dev branch
git branch dev
# Switch to dev branch
git checkout dev

# View remote repository address
git remote -v
# View local, remote, and all branches
git branch
git branch -r
git branch -a
# View branch tracking relationships
git branch -vv

# Associate local branch to remote address
git remote add origin "address"

# Pull remote branch
git pull
git fetch + git merge
# Note: Executing `git pull` on the current branch will `git fetch` for other branches but will only merge the current branch.

# Push local dev branch to remote master
git push origin dev:master
# Push and set upstream tracking for dev branch
git push -u origin dev:master
# Unset upstream tracking for current branch
git branch --unset-upstream dev
# Modify tracking branch of current branch to master
git branch -u origin/master

# Delete local dev branch
git branch -d dev
# Delete remote dev branch
git push origin :dev
git push origin --delete dev

# Checkout and track remote dev branch locally
git checkout dev

# Push all branches at once
git push --all origin
```

## 4. Git rebase {#git-rebase}

**Rebase Operation**: Allows editing, deleting, copying, and pasting linear commit history segments. Therefore, properly using rebase keeps your commit history clean and concise!

> **[Warning]** Never rebase commits that have already been pushed to a public repository (unless it's a branch exclusively under your own control), otherwise it will cause severe history conflicts.

## 5. Git cherry-pick {#git-cherry-pick}

1. `cherry-pick` is used to apply a specific commit from one branch onto another:
   ![](/assets/img/git/cherry-pick-1.png)
2. Transferring multiple commits:
   ![](/assets/img/git/cherry-pick-2.png)
3. Common arguments:
   ![](/assets/img/git/cherry-pick-3.png)
4. Conflict resolution:
   ![](/assets/img/git/cherry-pick-4.png)

## 6. Git Rollback Operations {#git-rollback}

### 6.1 `restore` Command

| Command                             | Action                                                         | Remark                       |
| ----------------------------------- | -------------------------------------------------------------- | ---------------------------- |
| `git restore --worktree README.md`  | Reverts modifications in the working directory for `README.md` | Parameter equivalent to `-W` |
| `git restore --staged README.md`    | Reverts staged changes, resetting file state to pre-add        | Parameter equivalent to `-S` |
| `git restore -s HEAD~1 README.md`   | Switches working directory to previous commit version          |                              |
| `git restore -s commitId README.md` | Switches working directory to a specific commit id             |                              |

### 6.2 `reset` Command

| Command                          | Action                                                                | Remark                                             |
| -------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| `git reset --soft HEAD^ [file]`  | Reverts strictly to last version, placing diffs into the staging area | Can target files individually                      |
| `git reset --mixed HEAD^ [file]` | Reverts strictly to last version, placing diffs into the working area | Can target files individually                      |
| `git reset --hard HEAD^`         | Reverts all contents to last version, discarding all diffs            | Restores entirely, cannot selectively revert files |
| `git reset HEAD^`                | Same as `git reset --mixed HEAD^`                                     |                                                    |

### 6.3 Difference between `revert` and `reset`

![](/assets/img/git/revert-1.png)
![](/assets/img/git/revert-2.png)

```bash
git revert -n <version2-commitid>
```

### 6.4 `checkout`

```bash
# Undo modifications to 'file' in working directory
git checkout -- file
```

### 6.5 Reverting Remote Repository Commits

```bash
# First use reset to revert local repository
git reset HEAD^
# Then force push
git push -f
```

### 6.6 `git rm` vs `rm`

- `git rm` deletes a file and tracks its removal into the staging area. It's equivalent to `rm file` followed by `git add file`.

**Difference between `git rm` and `git rm --cached`:**

```bash
# When we need to remove a file from staging/branch AND working tree:
git rm file_path
git commit -m 'delete somefile'
git push

# When we need to remove a file from tracking but KEEP it locally:
git rm --cached file_path
git commit -m 'delete remote somefile'
git push
```

### 6.7 Modifying Last Commit

```bash
git commit --amend
```

### 6.8 Restoring Undone Actions

Through `git reflog`, you can see the operation log and utilize `git reset` to restore specific `commit_id`s:

```bash
git reflog
git reset --hard <commit_id>
```

### 6.9 Common Rollbacks Summary:

- **Restoring Staged Revisions to Working Tree:**
  1. `git restore --staged file`
  2. `git reset HEAD file`
- **Reverting Working Tree Modifications:**
  1. `git restore file`
  2. `git checkout -- file`
  3. `git reset --hard` (Restores all changes, cannot target specific file)
- **Restoring Repository Edits to Staging Area:**
  - `git reset --soft HEAD^` (Returns to previous commit)
- **Restoring Repository Edits to Working Tree:**
  - `git reset --mixed HEAD^`
- **Reverting Completely to The Last Version:**
  - `git reset --hard HEAD^`

## 7. Git Stash {#git-stash}

![](/assets/img/git/stash-1.png)

**Stashing Untracked Files `% git stash -u`**
During development, newly added files aren't part of any branch yet. Usually, they can be brought over to another branch uninterrupted if there's no conflict. By default, `git stash` ignores them. If you want to stash them, use the `-u` parameter. Executing it will clear them from your working tree.

**Stashing Ignored Files `% git stash -a`**
Normally, ignored files are not stashed either. Using `-a` ensures they are stashed along with untracked files.

**Stashing into a New Branch `% git stash branch <branchname> [<stash>]`**
Often, consecutive `git stash push` commands clutter up the current branch. Directly applying them isn't fitting, so you can leverage this command to create a branch based off a `<stash>`'s initial `commit-id`. This new branch receives the applied stash, making it easier to resume interrupted work. Default stash index is `stash@{0}`.
