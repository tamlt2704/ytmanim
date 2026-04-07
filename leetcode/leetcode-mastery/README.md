# LeetCode Mastery Plan

24 problems across 8 phases, organized by pattern. Each solution includes the problem description, pattern name, approach, key insight, time/space complexity, and tests.

## How to Use

```bash
# Java
./gradlew test

# Python
cd python && python -m pytest test_all.py -v
```

## Study Plan

Spend 1-2 weeks per phase. For each problem: understand the pattern first, then code it, then verify with tests.

### Phase 1: Arrays & Hashing (Foundation)

The most common pattern. If you can only study one topic, study this.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 1 | Two Sum | Easy | Hash Map Complement | Store seen values, check if complement exists |
| 49 | Group Anagrams | Medium | Canonical Key | Sort string → anagrams share the same key |
| 128 | Longest Consecutive Sequence | Hard | Set + Sequence Start | Only count from sequence starts (num-1 not in set) |

### Phase 2: Two Pointers & Sliding Window

The second most common pattern. Master the "expand right, shrink left" template.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 125 | Valid Palindrome | Easy | Converging Pointers | Two pointers from both ends, skip non-alphanumeric |
| 3 | Longest Substring Without Repeating | Medium | Sliding Window + Map | Jump left pointer past duplicate instead of shrinking one-by-one |
| 76 | Minimum Window Substring | Hard | Sliding Window + Formed Counter | Track "formed" count to avoid re-checking all frequencies |

### Phase 3: Stack & Queue

Stacks solve anything involving matching, nesting, or "next greater/smaller element."

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 20 | Valid Parentheses | Easy | Stack for Matching | Most recent unmatched opener is always on top |
| 739 | Daily Temperatures | Medium | Monotonic Decreasing Stack | Pop cooler temps when warmer one arrives |
| 84 | Largest Rectangle in Histogram | Hard | Monotonic Increasing Stack | Pop gives right boundary, stack top gives left boundary |

### Phase 4: Binary Search

Not just "find element in sorted array." Binary search works on any monotonic condition.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 704 | Binary Search | Easy | Classic | Use left + (right-left)/2 to avoid overflow |
| 33 | Search in Rotated Sorted Array | Medium | Sorted Half Detection | One half is always sorted — use it to decide direction |
| 4 | Median of Two Sorted Arrays | Hard | Binary Search on Partition | Search for partition point, not the median directly |

### Phase 5: Linked Lists

Pointer manipulation. Draw it out on paper first.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 206 | Reverse Linked List | Easy | Three Pointers | Save next, reverse, advance — that's it |
| 23 | Merge K Sorted Lists | Hard | Min-Heap | Heap of k heads, pop smallest, push its next |

### Phase 6: Trees & Graphs

DFS for depth questions, BFS for level/shortest-path questions.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 104 | Maximum Depth | Easy | DFS Recursion | depth = 1 + max(left, right) |
| 102 | Level Order Traversal | Medium | BFS with Queue | queue.size() at level start separates levels |
| 297 | Serialize/Deserialize BT | Hard | Preorder + Null Markers | Null markers make preorder sufficient to reconstruct |

### Phase 7: Dynamic Programming

The hardest topic. Start with 1D, then 2D. Always define the subproblem first.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 70 | Climbing Stairs | Easy | 1D DP (Fibonacci) | dp[i] = dp[i-1] + dp[i-2], optimize to O(1) space |
| 300 | Longest Increasing Subsequence | Medium | 1D DP | dp[i] = max(dp[j]+1) for all j < i where nums[j] < nums[i] |
| 72 | Edit Distance | Hard | 2D DP | Each cell depends on left, top, diagonal |

### Phase 8: Backtracking

Template: choose → explore → unchoose. Works for all combinatorial problems.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 78 | Subsets | Medium | Basic Backtracking | Include or skip each element → 2^n subsets |
| 79 | Word Search | Medium | Grid DFS Backtracking | Mark visited in-place, restore after backtracking |
| 51 | N-Queens | Hard | Constraint Backtracking | row-col identifies diagonals, row+col identifies anti-diagonals |

### Phase 9: Graphs

Connected components, cycle detection, shortest path. The most versatile topic.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 200 | Number of Islands | Medium | DFS Flood Fill | Each DFS call sinks one island; count the calls |
| 207 | Course Schedule | Medium | Topological Sort (Kahn's) | If processed count < numCourses, there's a cycle |
| 127 | Word Ladder | Hard | BFS Shortest Path | Generate neighbors by mutating each character position |

### Phase 10: Heap / Priority Queue

When you need the min/max/kth element efficiently.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 215 | Kth Largest Element | Medium | Min-Heap of Size K | Heap top = kth largest after processing all elements |
| 347 | Top K Frequent Elements | Medium | Bucket Sort | Index = frequency, walk from highest bucket down |
| 295 | Find Median from Data Stream | Hard | Two Heaps | Max-heap for left half, min-heap for right half |

### Phase 11: Greedy

Make the locally optimal choice at each step. Hard to prove correct, easy to code.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 55 | Jump Game | Medium | Track Max Reach | If i > maxReach, you're stuck |
| 621 | Task Scheduler | Medium | Frequency Frame | Most frequent task creates the frame; others fill gaps |

### Phase 12: Intervals

Sort first, then linear scan. Almost every interval problem follows this template.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 56 | Merge Intervals | Medium | Sort by Start + Merge | Overlap iff current.start ≤ previous.end |
| 435 | Non-overlapping Intervals | Medium | Sort by End + Greedy | Keep earliest-ending interval to maximize room |

### Phase 13: Trie (Prefix Tree)

Fast prefix lookups. Essential for autocomplete, spell check, IP routing.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 208 | Implement Trie | Medium | Prefix Tree | Each node has 26 children; shared prefixes share nodes |
| 211 | Add and Search Words | Medium | Trie + DFS Wildcard | '.' triggers DFS into all 26 children |

### Phase 14: Union Find (Disjoint Set)

Connected components and cycle detection in O(α(n)) ≈ O(1) per operation.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 323 | Connected Components | Medium | Union-Find | Each union decrements component count |
| 684 | Redundant Connection | Medium | Union-Find Cycle | First edge where union returns false = the cycle edge |

### Phase 15: Bit Manipulation

XOR, shifts, and masks. Constant space tricks.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 136 | Single Number | Easy | XOR | a ^ a = 0, pairs cancel out |
| 338 | Counting Bits | Easy | DP on Bits | dp[i] = dp[i>>1] + (i&1) |
| 190 | Reverse Bits | Easy | Bit Extraction | Extract last bit, place at mirrored position |

### Phase 16: Math

Number theory, fast exponentiation, cycle detection.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 202 | Happy Number | Easy | Cycle Detection | Sum of digit squares either reaches 1 or loops |
| 50 | Pow(x, n) | Medium | Binary Exponentiation | x^n = (x²)^(n/2), reduces O(n) to O(log n) |

### Phase 17: Matrix

In-place transformations and traversal patterns.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 54 | Spiral Matrix | Medium | Shrinking Boundaries | top/bottom/left/right boundaries, traverse and shrink |
| 48 | Rotate Image | Medium | Transpose + Reverse | 90° clockwise = transpose then reverse each row |

### Phase 18: Design

Data structure design — the most common "system design lite" questions.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 146 | LRU Cache | Medium | HashMap + Doubly Linked List | O(1) lookup + O(1) eviction |
| 155 | Min Stack | Medium | Two Stacks | Second stack tracks running minimum |

### Phase 19: Monotonic Queue

Sliding window min/max in O(n). Extension of monotonic stack.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 239 | Sliding Window Maximum | Hard | Monotonic Decreasing Deque | Remove smaller elements from back; front = window max |

### Phase 20: String

Pattern matching, encoding, palindromes.

| # | Problem | Difficulty | Pattern | Key Insight |
|---|---------|-----------|---------|-------------|
| 5 | Longest Palindromic Substring | Medium | Expand Around Center | 2n-1 centers, expand outward from each |
| 271 | Encode and Decode Strings | Medium | Length-Prefix Encoding | "5#hello" handles any character including delimiters |

## Pattern Recognition Cheat Sheet

When you see... → Try this pattern:

- "Find pair/triplet that sums to X" → Hash Map or Two Pointers
- "Longest/shortest substring with condition" → Sliding Window
- "Matching brackets/parentheses" → Stack
- "Next greater/smaller element" → Monotonic Stack
- "Sorted array + search" → Binary Search
- "Reverse/merge linked list" → Pointer Manipulation
- "Tree depth/path/traversal" → DFS or BFS
- "Count ways / min cost / optimal" → Dynamic Programming
- "Generate all combinations/permutations" → Backtracking
- "Shortest path in graph" → BFS (unweighted) or Dijkstra (weighted)
- "Connected components / flood fill" → DFS/BFS on Grid
- "Dependency ordering / cycle detection" → Topological Sort
- "Kth largest/smallest / top K" → Heap (Priority Queue)
- "Running median / two halves" → Two Heaps
- "Can you reach / max coverage" → Greedy
- "Scheduling with cooldown" → Greedy + Frequency
- "Overlapping intervals" → Sort + Linear Scan
- "Merge intervals" → Sort by Start + Merge
- "Prefix matching / autocomplete" → Trie
- "Connected components / is connected" → Union-Find
- "Find the cycle-creating edge" → Union-Find
- "Single element among duplicates" → XOR
- "Count bits / bit patterns" → DP on Bits
- "Digit manipulation / cycle detection" → Math + HashSet
- "Spiral / rotate matrix" → Boundary Shrinking or Transpose
- "O(1) get + eviction policy" → HashMap + Linked List (LRU)
- "Sliding window min/max" → Monotonic Deque
- "Longest palindrome" → Expand Around Center
- "Encode/decode strings" → Length-Prefix

## Languages

Every problem has both Java and Python implementations with identical logic. The Java solutions are in `src/main/java/`, Python in `python/`. Use whichever you're interviewing in — the patterns are the same.
