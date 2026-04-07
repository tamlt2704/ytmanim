"""Phase 2: Two Pointers & Sliding Window"""

# --- #125 Valid Palindrome ---
def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum(): left += 1
        while left < right and not s[right].isalnum(): right -= 1
        if s[left].lower() != s[right].lower(): return False
        left += 1; right -= 1
    return True

# --- #3 Longest Substring Without Repeating ---
def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    max_len = left = 0
    for right, c in enumerate(s):
        if c in last_seen and last_seen[c] >= left:
            left = last_seen[c] + 1
        last_seen[c] = right
        max_len = max(max_len, right - left + 1)
    return max_len

# --- #76 Minimum Window Substring ---
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t: return ""
    need = Counter(t)
    required = len(need)
    formed = 0
    window = {}
    result = (float("inf"), 0, 0)
    left = 0

    for right, c in enumerate(s):
        window[c] = window.get(c, 0) + 1
        if c in need and window[c] == need[c]:
            formed += 1
        while left <= right and formed == required:
            if right - left + 1 < result[0]:
                result = (right - left + 1, left, right)
            lc = s[left]
            window[lc] -= 1
            if lc in need and window[lc] < need[lc]:
                formed -= 1
            left += 1

    return "" if result[0] == float("inf") else s[result[1]:result[2]+1]
