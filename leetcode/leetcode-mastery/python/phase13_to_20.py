"""Phases 13-20: Trie, Union Find, Bit, Math, Matrix, Design, Monotonic Queue, String"""

from collections import deque

# === Phase 13: Trie ===

class Trie:
    def __init__(self):
        self.children = {}
        self.is_end = False

    def insert(self, word):
        node = self
        for c in word:
            if c not in node.children: node.children[c] = Trie()
            node = node.children[c]
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find(prefix) is not None

    def _find(self, s):
        node = self
        for c in s:
            if c not in node.children: return None
            node = node.children[c]
        return node

class WordDictionary:
    def __init__(self):
        self.children = {}
        self.is_end = False

    def add_word(self, word):
        node = self
        for c in word:
            if c not in node.children: node.children[c] = WordDictionary()
            node = node.children[c]
        node.is_end = True

    def search(self, word):
        return self._dfs(word, 0)

    def _dfs(self, word, idx):
        if idx == len(word): return self.is_end
        c = word[idx]
        if c == '.':
            return any(child._dfs(word, idx + 1) for child in self.children.values())
        if c not in self.children: return False
        return self.children[c]._dfs(word, idx + 1)


# === Phase 14: Union Find ===

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        if self.rank[ra] < self.rank[rb]: self.parent[ra] = rb
        elif self.rank[ra] > self.rank[rb]: self.parent[rb] = ra
        else: self.parent[rb] = ra; self.rank[ra] += 1
        return True

def count_components(n, edges):
    uf = UnionFind(n)
    components = n
    for a, b in edges:
        if uf.union(a, b): components -= 1
    return components

def find_redundant_connection(edges):
    uf = UnionFind(len(edges) + 1)
    for a, b in edges:
        if not uf.union(a, b): return [a, b]
    return []


# === Phase 15: Bit Manipulation ===

def single_number(nums): 
    result = 0
    for n in nums: result ^= n
    return result

def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1): dp[i] = dp[i >> 1] + (i & 1)
    return dp

def reverse_bits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result


# === Phase 16: Math ===

def is_happy(n):
    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = sum(int(d) ** 2 for d in str(n))
    return n == 1

def my_pow(x, n):
    if n < 0: x, n = 1/x, -n
    result = 1
    while n > 0:
        if n & 1: result *= x
        x *= x
        n >>= 1
    return result


# === Phase 17: Matrix ===

def spiral_order(matrix):
    result = []
    top, bottom, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1
    while top <= bottom and left <= right:
        for c in range(left, right+1): result.append(matrix[top][c])
        top += 1
        for r in range(top, bottom+1): result.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left-1, -1): result.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top-1, -1): result.append(matrix[r][left])
            left += 1
    return result

def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i+1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()


# === Phase 18: Design ===

class LRUCache:
    def __init__(self, capacity):
        from collections import OrderedDict
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache: self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        self.min_stack.append(min(val, self.min_stack[-1] if self.min_stack else val))

    def pop(self): self.stack.pop(); self.min_stack.pop()
    def top(self): return self.stack[-1]
    def get_min(self): return self.min_stack[-1]


# === Phase 19: Monotonic Queue ===

def max_sliding_window(nums, k):
    dq = deque()
    result = []
    for i, n in enumerate(nums):
        while dq and dq[0] < i - k + 1: dq.popleft()
        while dq and nums[dq[-1]] < n: dq.pop()
        dq.append(i)
        if i >= k - 1: result.append(nums[dq[0]])
    return result


# === Phase 20: String ===

def longest_palindrome(s):
    start = max_len = 0
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]: l -= 1; r += 1
        return r - l - 1
    for i in range(len(s)):
        ln = max(expand(i, i), expand(i, i+1))
        if ln > max_len:
            max_len = ln
            start = i - (ln - 1) // 2
    return s[start:start + max_len]

def encode(strs):
    return ''.join(f"{len(s)}#{s}" for s in strs)

def decode(s):
    result, i = [], 0
    while i < len(s):
        j = s.index('#', i)
        length = int(s[i:j])
        result.append(s[j+1:j+1+length])
        i = j + 1 + length
    return result
