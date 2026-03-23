---
title: "Vim"
description: "A summary of core Vim operations, including the four modes, fast text insertion, quick movement, efficient editing, and copy/paste handling."
date: "2021-09-18"
tags: ["Vim", "Tools", "Editor"]
---

Whether on a remote server or conducting daily code edits, mastering basic Vim commands will drastically boost your editing speeds. This article documents essential and high-frequency commands based on practical Vim application.

## 1. The Four Vim Modes {#vim-modes}

Vim natively consists of several operational modes: The Normal mode, Command mode, Insert mode, and Visual mode.

1. **Normal Mode**: Opened by default. Press `ESC` or `Ctrl+[` to return to this mode securely from any arbitrary state. Most quick commands are parsed here.
2. **Visual Mode**:
   - `v`: Character-based visual block selection.
   - `V`: Entire line selection.
   - `Ctrl+V`: Visual block (column-based) selection.

## 2. Insert Mode {#vim-insert}

While in Normal mode, use the following keys to leap directly into **Insert mode** where text can be normally typed:

```bash
i (insert) # Insert at the current cursor position
I          # Jump to the very front of the line and insert

a (append) # Append insert right after the cursor
A          # Jump to the absolute end of the line and append insert

o (open a line below) # Open a new blank line under the cursor to insert
O (open a line up)    # Open a new blank line above the cursor to insert
```

## 3. Quick Editing Commands {#vim-edit}

### Deletion and Escape Shortcuts (Insert Mode)

```bash
Ctrl+h # Delete the previous character
Ctrl+w # Delete the previous word
Ctrl+u # Delete the entire current line
Ctrl+[ # Replaces the standard ESC key to return to Normal mode quicker
```

### Word and Line Removals (Normal Mode)

```bash
daw # Delete Around Word: Deletes the word including surrounding whitespaces
diw # Delete In Word: Deletes only the word itself, leaving surrounding spaces
d0  # Delete from cursor backwards strictly to the start of the line
d$  # Delete from cursor forwards exactly to the end of the line
dd  # Delete the entire current line
2d  # Delete 2 lines sequentially downwards
2x  # Delete 2 specific characters starting directly from cursor

# Tip: `d` and `x` naturally composite with text segments highlighted internally in Visual mode.
```

### Modification and Substitution

Make use of `c` (change), `r` (replace) and `s` (substitute) macros.

```bash
r   # (replace) Replace an exact single character under the current cursor
R   # Enter persistent Replace mode
c   # (change) Multi-faceted delete + insert command. e.g. `caw` replaces a word, `ct)` modifies everything up until a parenthesis
s   # (substitute) Deletes current character and switches strictly to insert mode
S   # Flushes and deletes entire current line and switches to insert mode
```

### Quick Searching

```bash
/   # Start prompt to look forwards downwards
?   # Start prompt to look backwards upwards
n/N # Progress/Regress to the next matching find result
```

## 4. Rapid Cursor Movement {#vim-movement}

Stop touching those arrow keys! Build muscle memory effectively.

### Foundational Traversal

```bash
h, j, k, l # Respectively equivalent to Left, Down, Up, Right on arrows

gi # Jumps to position of last change/edit globally and instantly accesses Insert mode

w/W # Jump forward to start of the next targeted word
e/E # Jump forward to the very end of current/next targeted word
b/B # Jump back to the start of the previous targeted word
# Pro-tip: Lowercase commands split text strictly by syntax 'non-blank' entities, whereas uppercase letters delimit by 'blank' whitespaces essentially guaranteeing further structural leaps.
```

### Single Character In-line Seeking

```bash
f{char} # Move forward right onto the first matching target character in line
t{char} # Move forward landing precisely onto the character before target

# Note: Uppercase variants `F` and `T` traverse relatively backwards in line. Using `;` (semicolon) searches forward repeating this same command, whilst `,` (comma) reverses traverse direction dynamically on this lookup.
```

### Anchors and Line Jumping

```bash
0  # Head straight to the absolute first column of current line
^  # Shift to the first actual non-blank visible character on current line
$  # Head directly to the farthest absolute end of current line
g_ # Shift strictly onto the LAST non-blank visible character

3$ # Shifts and anchors immediately to the end whitespace of third row below
```

### Screen & Global Locomotion

```bash
gg / G        # Jump straight to absolute first line / absolute bottom final line
Ctrl+o        # Step backwards resolving last immediate jump origin

H / M / L     # Anchors viewport cursor alignment across Top (High), Middle, Bottom (Low)

Ctrl+u/Ctrl+f # Paging navigation scrolling up/down significantly
zz            # Realines current executing line exactly up to center screen
```

## 5. Copy, Paste, & Cut Handling {#vim-copy-paste}

```bash
y (yank)   # Globally copies selected text string
p (paste)  # Globally pastes copied string straight after the current cursor position
d          # Globally cuts deleted segments simultaneously storing them

yiw        # Copy simply via 'Yank In Word' pointing at it
yy         # Yanks an entire row line
xp         # Special trick shortcut natively interpreting `x` (cut relative char rightwards) and `p` (paste previously cut immediately next), achieving a clean two char swap.
```
