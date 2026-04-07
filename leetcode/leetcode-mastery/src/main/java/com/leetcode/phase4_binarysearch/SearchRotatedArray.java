package com.leetcode.phase4_binarysearch;

/**
 * LeetCode #33 - Search in Rotated Sorted Array (Medium)
 *
 * PROBLEM: Array was sorted then rotated at some pivot. Search for target in O(log n).
 * Example: [4,5,6,7,0,1,2], target=0 → 4
 *
 * PATTERN: Modified Binary Search with Sorted Half Detection
 *
 * APPROACH:
 * - At each step, one half of the array is always sorted
 * - Determine which half is sorted by comparing nums[left] with nums[mid]
 * - Check if target falls within the sorted half
 * - If yes, search that half. If no, search the other half.
 *
 * KEY INSIGHT: Even in a rotated array, at least one half around mid is always sorted.
 * Use that sorted half to decide which direction to go.
 *
 * TIME: O(log n)
 * SPACE: O(1)
 */
public class SearchRotatedArray {

    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;

            // Left half is sorted
            if (nums[left] <= nums[mid]) {
                if (target >= nums[left] && target < nums[mid]) {
                    right = mid - 1; // target is in the sorted left half
                } else {
                    left = mid + 1;  // target is in the right half
                }
            }
            // Right half is sorted
            else {
                if (target > nums[mid] && target <= nums[right]) {
                    left = mid + 1;  // target is in the sorted right half
                } else {
                    right = mid - 1; // target is in the left half
                }
            }
        }

        return -1;
    }
}
