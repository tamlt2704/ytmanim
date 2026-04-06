# LeetCode Patterns & Problem Tracker

> Track your progress: replace `[ ]` with `[x]` as you solve each problem.

---

## Pattern 1: Two Pointers

**When to use:** Sorted arrays, pair/triplet finding, palindromes, partitioning.

**Key idea:** Use two indices moving toward each other or in the same direction.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Two Sum II - Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | Easy | [ ] |
| 2 | [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | Easy | [ ] |
| 3 | [3Sum](https://leetcode.com/problems/3sum/) | Medium | [ ] |
| 4 | [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Medium | [ ] |
| 5 | [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) | Hard | [ ] |
| 6 | [Move Zeroes](https://leetcode.com/problems/move-zeroes/) | Easy | [ ] |
| 7 | [Sort Colors](https://leetcode.com/problems/sort-colors/) | Medium | [ ] |

---

## Pattern 2: Sliding Window

**When to use:** Subarray/substring problems with a constraint (max sum, distinct chars, etc.).

**Key idea:** Expand/shrink a window over the array to maintain a valid state.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Easy | [ ] |
| 2 | [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium | [ ] |
| 3 | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) | Medium | [ ] |
| 4 | [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Hard | [ ] |
| 5 | [Permutation in String](https://leetcode.com/problems/permutation-in-string/) | Medium | [ ] |
| 6 | [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) | Easy | [ ] |
| 7 | [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) | Hard | [ ] |

---

## Pattern 3: HashMap / HashSet

**When to use:** Frequency counting, lookups, duplicates, grouping.

**Key idea:** O(1) lookup to avoid nested loops.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Two Sum](https://leetcode.com/problems/two-sum/) | Easy | [ ] |
| 2 | [Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Medium | [ ] |
| 3 | [Valid Anagram](https://leetcode.com/problems/valid-anagram/) | Easy | [ ] |
| 4 | [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Medium | [ ] |
| 5 | [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) | Medium | [ ] |
| 6 | [Encode and Decode TinyURL](https://leetcode.com/problems/encode-and-decode-tinyurl/) | Medium | [ ] |
| 7 | [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) | Medium | [ ] |

---

## Pattern 4: Binary Search

**When to use:** Sorted data, search space reduction, "minimum/maximum that satisfies condition".

**Key idea:** Halve the search space each step. Also works on answer space (not just arrays).

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Binary Search](https://leetcode.com/problems/binary-search/) | Easy | [ ] |
| 2 | [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) | Medium | [ ] |
| 3 | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Medium | [ ] |
| 4 | [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Medium | [ ] |
| 5 | [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Medium | [ ] |
| 6 | [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/) | Medium | [ ] |
| 7 | [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Hard | [ ] |

---

## Pattern 5: Stack

**When to use:** Matching brackets, next greater/smaller element, expression evaluation, monotonic patterns.

**Key idea:** LIFO — process elements in reverse order of arrival.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) | Easy | [ ] |
| 2 | [Min Stack](https://leetcode.com/problems/min-stack/) | Medium | [ ] |
| 3 | [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) | Medium | [ ] |
| 4 | [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | Medium | [ ] |
| 5 | [Car Fleet](https://leetcode.com/problems/car-fleet/) | Medium | [ ] |
| 6 | [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Hard | [ ] |
| 7 | [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) | Easy | [ ] |

---

## Pattern 6: Linked List

**When to use:** In-place reversal, cycle detection, merge, reorder.

**Key idea:** Use dummy nodes, slow/fast pointers, and careful pointer manipulation.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) | Easy | [ ] |
| 2 | [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) | Easy | [ ] |
| 3 | [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) | Easy | [ ] |
| 4 | [Reorder List](https://leetcode.com/problems/reorder-list/) | Medium | [ ] |
| 5 | [Remove Nth Node From End](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Medium | [ ] |
| 6 | [LRU Cache](https://leetcode.com/problems/lru-cache/) | Medium | [ ] |
| 7 | [Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Hard | [ ] |

---

## Pattern 7: Trees (BFS & DFS)

**When to use:** Hierarchical data, path problems, level-order traversal, validation.

**Key idea:** Recursion for DFS, queue for BFS. Think about what info each node needs from children/parent.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) | Easy | [ ] |
| 2 | [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Easy | [ ] |
| 3 | [Same Tree](https://leetcode.com/problems/same-tree/) | Easy | [ ] |
| 4 | [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Medium | [ ] |
| 5 | [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) | Medium | [ ] |
| 6 | [Lowest Common Ancestor of BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) | Medium | [ ] |
| 7 | [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) | Medium | [ ] |
| 8 | [Construct Binary Tree from Preorder and Inorder](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) | Medium | [ ] |
| 9 | [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Hard | [ ] |
| 10 | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Hard | [ ] |

---

## Pattern 8: Graph (BFS / DFS / Union-Find)

**When to use:** Connected components, shortest path, cycle detection, grid traversal.

**Key idea:** Build adjacency list, track visited, choose BFS (shortest path) or DFS (exhaustive search).

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Number of Islands](https://leetcode.com/problems/number-of-islands/) | Medium | [ ] |
| 2 | [Clone Graph](https://leetcode.com/problems/clone-graph/) | Medium | [ ] |
| 3 | [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) | Medium | [ ] |
| 4 | [Course Schedule](https://leetcode.com/problems/course-schedule/) | Medium | [ ] |
| 5 | [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | Medium | [ ] |
| 6 | [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/) | Medium | [ ] |
| 7 | [Number of Connected Components](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Medium | [ ] |
| 8 | [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | Medium | [ ] |
| 9 | [Word Ladder](https://leetcode.com/problems/word-ladder/) | Hard | [ ] |
| 10 | [Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) | Hard | [ ] |

---

## Pattern 9: Heap / Priority Queue

**When to use:** Top-K, K-th largest/smallest, merge sorted streams, scheduling.

**Key idea:** Maintain a min/max heap of size K for efficient extraction.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Easy | [ ] |
| 2 | [Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) | Easy | [ ] |
| 3 | [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/) | Medium | [ ] |
| 4 | [Task Scheduler](https://leetcode.com/problems/task-scheduler/) | Medium | [ ] |
| 5 | [Design Twitter](https://leetcode.com/problems/design-twitter/) | Medium | [ ] |
| 6 | [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Hard | [ ] |
| 7 | [Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Hard | [ ] |

---

## Pattern 10: Backtracking

**When to use:** Permutations, combinations, subsets, constraint satisfaction (Sudoku, N-Queens).

**Key idea:** Build candidates incrementally, abandon (backtrack) when constraints are violated.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Subsets](https://leetcode.com/problems/subsets/) | Medium | [ ] |
| 2 | [Combination Sum](https://leetcode.com/problems/combination-sum/) | Medium | [ ] |
| 3 | [Permutations](https://leetcode.com/problems/permutations/) | Medium | [ ] |
| 4 | [Word Search](https://leetcode.com/problems/word-search/) | Medium | [ ] |
| 5 | [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) | Medium | [ ] |
| 6 | [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Medium | [ ] |
| 7 | [N-Queens](https://leetcode.com/problems/n-queens/) | Hard | [ ] |

---

## Pattern 11: Dynamic Programming (1D)

**When to use:** Overlapping subproblems, optimal substructure. "Count ways", "min/max cost", "is it possible".

**Key idea:** Define state → recurrence → base case. Start with top-down memo, optimize to bottom-up.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) | Easy | [ ] |
| 2 | [House Robber](https://leetcode.com/problems/house-robber/) | Medium | [ ] |
| 3 | [House Robber II](https://leetcode.com/problems/house-robber-ii/) | Medium | [ ] |
| 4 | [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) | Medium | [ ] |
| 5 | [Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/) | Medium | [ ] |
| 6 | [Decode Ways](https://leetcode.com/problems/decode-ways/) | Medium | [ ] |
| 7 | [Coin Change](https://leetcode.com/problems/coin-change/) | Medium | [ ] |
| 8 | [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) | Medium | [ ] |
| 9 | [Word Break](https://leetcode.com/problems/word-break/) | Medium | [ ] |
| 10 | [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | Medium | [ ] |

---

## Pattern 12: Dynamic Programming (2D)

**When to use:** Two sequences, grid paths, knapsack variants.

**Key idea:** State depends on two dimensions (e.g., two string indices, grid row/col).

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Unique Paths](https://leetcode.com/problems/unique-paths/) | Medium | [ ] |
| 2 | [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) | Medium | [ ] |
| 3 | [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | Medium | [ ] |
| 4 | [Target Sum](https://leetcode.com/problems/target-sum/) | Medium | [ ] |
| 5 | [Interleaving String](https://leetcode.com/problems/interleaving-string/) | Medium | [ ] |
| 6 | [Edit Distance](https://leetcode.com/problems/edit-distance/) | Medium | [ ] |
| 7 | [Burst Balloons](https://leetcode.com/problems/burst-balloons/) | Hard | [ ] |
| 8 | [Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) | Hard | [ ] |

---

## Pattern 13: Greedy

**When to use:** Local optimal choice leads to global optimal. Interval scheduling, activity selection.

**Key idea:** Sort by some criteria, then make the greedily best choice at each step.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) | Medium | [ ] |
| 2 | [Jump Game](https://leetcode.com/problems/jump-game/) | Medium | [ ] |
| 3 | [Jump Game II](https://leetcode.com/problems/jump-game-ii/) | Medium | [ ] |
| 4 | [Gas Station](https://leetcode.com/problems/gas-station/) | Medium | [ ] |
| 5 | [Hand of Straights](https://leetcode.com/problems/hand-of-straights/) | Medium | [ ] |
| 6 | [Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Medium | [ ] |
| 7 | [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) | Medium | [ ] |
| 8 | [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) | Medium | [ ] |

---

## Pattern 14: Trie

**When to use:** Prefix matching, autocomplete, word dictionaries, XOR problems.

**Key idea:** Tree where each node represents a character; shared prefixes share paths.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/) | Medium | [ ] |
| 2 | [Design Add and Search Words](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | Medium | [ ] |
| 3 | [Word Search II](https://leetcode.com/problems/word-search-ii/) | Hard | [ ] |

---

## Pattern 15: Intervals

**When to use:** Overlapping ranges, merging, inserting, scheduling.

**Key idea:** Sort by start (or end), then process linearly.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) | Easy | [ ] |
| 2 | [Insert Interval](https://leetcode.com/problems/insert-interval/) | Medium | [ ] |
| 3 | [Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Medium | [ ] |
| 4 | [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) | Medium | [ ] |
| 5 | [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) | Medium | [ ] |

---

## Pattern 16: Bit Manipulation

**When to use:** Single number problems, power of two, counting bits, XOR tricks.

**Key idea:** XOR cancels duplicates, AND/OR for masking, shifts for division/multiplication by 2.

| # | Problem | Difficulty | Status |
|---|---------|-----------|--------|
| 1 | [Single Number](https://leetcode.com/problems/single-number/) | Easy | [ ] |
| 2 | [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) | Easy | [ ] |
| 3 | [Counting Bits](https://leetcode.com/problems/counting-bits/) | Easy | [ ] |
| 4 | [Reverse Bits](https://leetcode.com/problems/reverse-bits/) | Easy | [ ] |
| 5 | [Missing Number](https://leetcode.com/problems/missing-number/) | Easy | [ ] |
| 6 | [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/) | Medium | [ ] |

---

## Progress Summary

| Pattern | Total | Solved | Completion |
|---------|-------|--------|------------|
| Two Pointers | 7 | 0 | 0% |
| Sliding Window | 7 | 0 | 0% |
| HashMap/HashSet | 7 | 0 | 0% |
| Binary Search | 7 | 0 | 0% |
| Stack | 7 | 0 | 0% |
| Linked List | 7 | 0 | 0% |
| Trees | 10 | 0 | 0% |
| Graph | 10 | 0 | 0% |
| Heap | 7 | 0 | 0% |
| Backtracking | 7 | 0 | 0% |
| DP (1D) | 10 | 0 | 0% |
| DP (2D) | 8 | 0 | 0% |
| Greedy | 8 | 0 | 0% |
| Trie | 3 | 0 | 0% |
| Intervals | 5 | 0 | 0% |
| Bit Manipulation | 6 | 0 | 0% |
| **TOTAL** | **116** | **0** | **0%** |

---

## Suggested Order of Study

1. ✅ Two Pointers → Sliding Window → HashMap
2. ✅ Binary Search → Stack → Linked List
3. ✅ Trees → Graph → Heap
4. ✅ Backtracking → DP (1D) → DP (2D)
5. ✅ Greedy → Intervals → Trie → Bit Manipulation

> **Tip:** Solve all problems in one pattern before moving to the next.
> Update the Progress Summary table as you go!
