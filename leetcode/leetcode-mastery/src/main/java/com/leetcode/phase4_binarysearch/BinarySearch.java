package com.leetcode.phase4_binarysearch;

/**
 * LeetCode #704 - Binary Search (Easy)
 *
 * PROBLEM: Given a sorted array and target, return the index or -1.
 *
 * PATTERN: Classic Binary Search
 *
 * KEY INSIGHT: Binary search eliminates half the search space each iteration.
 * Use left + (right - left) / 2 instead of (left + right) / 2 to avoid integer overflow.
 *
 * TIME: O(log n)
 * SPACE: O(1)
 */
public class BinarySearch {

    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }

        return -1;
    }
}
