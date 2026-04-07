"""Phase 1: Arrays & Hashing"""

# --- #1 Two Sum ---
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value → index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# --- #49 Group Anagrams ---
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))  # sorted string as key
        groups[key].append(s)
    return list(groups.values())

# --- #128 Longest Consecutive Sequence ---
def longest_consecutive(nums: list[int]) -> int:
    num_set = set(nums)
    longest = 0
    for num in num_set:
        if num - 1 not in num_set:  # only start from sequence beginning
            length = 1
            while num + length in num_set:
                length += 1
            longest = max(longest, length)
    return longest
