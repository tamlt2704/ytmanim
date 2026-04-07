"""Phase 4: Binary Search"""

# --- #704 Binary Search ---
def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1

# --- #33 Search in Rotated Sorted Array ---
def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target: return mid
        if nums[left] <= nums[mid]:  # left half sorted
            if nums[left] <= target < nums[mid]: right = mid - 1
            else: left = mid + 1
        else:  # right half sorted
            if nums[mid] < target <= nums[right]: left = mid + 1
            else: right = mid - 1
    return -1

# --- #4 Median of Two Sorted Arrays ---
def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    while left <= right:
        p1 = (left + right) // 2
        p2 = (m + n + 1) // 2 - p1
        ml1 = float('-inf') if p1 == 0 else nums1[p1 - 1]
        mr1 = float('inf') if p1 == m else nums1[p1]
        ml2 = float('-inf') if p2 == 0 else nums2[p2 - 1]
        mr2 = float('inf') if p2 == n else nums2[p2]
        if ml1 <= mr2 and ml2 <= mr1:
            if (m + n) % 2 == 0:
                return (max(ml1, ml2) + min(mr1, mr2)) / 2
            return max(ml1, ml2)
        elif ml1 > mr2: right = p1 - 1
        else: left = p1 + 1
    raise ValueError("Input not sorted")
