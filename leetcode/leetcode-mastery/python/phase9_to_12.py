"""Phases 9-12: Graphs, Heap, Greedy, Intervals"""

from collections import deque, defaultdict, Counter
import heapq

# === Phase 9: Graphs ===

# --- #200 Number of Islands ---
def num_islands(grid):
    if not grid: return 0
    count = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                count += 1
                _sink(grid, r, c)
    return count

def _sink(grid, r, c):
    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] == '0':
        return
    grid[r][c] = '0'
    _sink(grid, r+1, c); _sink(grid, r-1, c); _sink(grid, r, c+1); _sink(grid, r, c-1)

# --- #207 Course Schedule ---
def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    for a, b in prerequisites:
        graph[b].append(a)
        in_degree[a] += 1
    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)
    processed = 0
    while queue:
        course = queue.popleft()
        processed += 1
        for nxt in graph[course]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0: queue.append(nxt)
    return processed == num_courses

# --- #127 Word Ladder ---
def ladder_length(begin_word, end_word, word_list):
    word_set = set(word_list)
    if end_word not in word_set: return 0
    queue = deque([(begin_word, 1)])
    visited = {begin_word}
    while queue:
        word, level = queue.popleft()
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                neighbor = word[:i] + c + word[i+1:]
                if neighbor == end_word: return level + 1
                if neighbor in word_set and neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, level + 1))
    return 0


# === Phase 10: Heap / Priority Queue ===

# --- #215 Kth Largest Element ---
def find_kth_largest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]

# --- #347 Top K Frequent Elements ---
def top_k_frequent(nums, k):
    freq = Counter(nums)
    # Bucket sort
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, count in freq.items():
        buckets[count].append(num)
    result = []
    for i in range(len(buckets) - 1, -1, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k: return result
    return result

# --- #295 Find Median from Data Stream ---
class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negate values)
        self.hi = []  # min-heap

    def add_num(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def find_median(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2


# === Phase 11: Greedy ===

# --- #55 Jump Game ---
def can_jump(nums):
    max_reach = 0
    for i, n in enumerate(nums):
        if i > max_reach: return False
        max_reach = max(max_reach, i + n)
    return True

# --- #621 Task Scheduler ---
def least_interval(tasks, n):
    freq = list(Counter(tasks).values())
    max_freq = max(freq)
    max_count = freq.count(max_freq)
    return max((max_freq - 1) * (n + 1) + max_count, len(tasks))


# === Phase 12: Intervals ===

# --- #56 Merge Intervals ---
def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

# --- #435 Non-overlapping Intervals ---
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[1])
    kept, last_end = 1, intervals[0][1]
    for start, end in intervals[1:]:
        if start >= last_end:
            kept += 1
            last_end = end
    return len(intervals) - kept
