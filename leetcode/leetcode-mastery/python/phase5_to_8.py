"""Phases 5-8: Linked Lists, Trees, DP, Backtracking"""

# === Phase 5: Linked Lists ===

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def from_list(values):
    dummy = ListNode(0)
    curr = dummy
    for v in values:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

# --- #206 Reverse Linked List ---
def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# --- #23 Merge K Sorted Lists ---
import heapq

def merge_k_lists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = ListNode(0)
    curr = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next


# === Phase 6: Trees ===

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# --- #104 Maximum Depth ---
def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# --- #102 Level Order Traversal ---
from collections import deque

def level_order(root):
    if not root: return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result


# === Phase 7: Dynamic Programming ===

# --- #70 Climbing Stairs ---
def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

# --- #300 Longest Increasing Subsequence ---
def length_of_lis(nums):
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

# --- #72 Edit Distance ---
def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])
    return dp[m][n]


# === Phase 8: Backtracking ===

# --- #78 Subsets ---
def subsets(nums):
    result = []
    def backtrack(start, current):
        result.append(current[:])
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return result

# --- #79 Word Search ---
def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, idx):
        if idx == len(word): return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[idx]:
            return False
        temp, board[r][c] = board[r][c], '#'
        found = dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1) or dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1)
        board[r][c] = temp
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0): return True
    return False

# --- #51 N-Queens ---
def solve_n_queens(n):
    result = []
    cols, diags, anti = set(), set(), set()
    board = [['.' ] * n for _ in range(n)]
    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or row-col in diags or row+col in anti:
                continue
            board[row][col] = 'Q'
            cols.add(col); diags.add(row-col); anti.add(row+col)
            backtrack(row + 1)
            board[row][col] = '.'
            cols.remove(col); diags.remove(row-col); anti.remove(row+col)
    backtrack(0)
    return result
