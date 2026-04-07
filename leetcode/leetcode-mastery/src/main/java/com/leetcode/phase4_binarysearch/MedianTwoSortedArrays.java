package com.leetcode.phase4_binarysearch;

/**
 * LeetCode #4 - Median of Two Sorted Arrays (Hard)
 *
 * PROBLEM: Find the median of two sorted arrays in O(log(m+n)) time.
 *
 * PATTERN: Binary Search on Partition Position
 *
 * APPROACH:
 * - We need to partition both arrays such that all left elements ≤ all right elements
 * - Binary search on the shorter array's partition point
 * - For each partition of nums1, the partition of nums2 is determined
 * - Valid partition: maxLeft1 ≤ minRight2 AND maxLeft2 ≤ minRight1
 *
 * KEY INSIGHT: Instead of merging arrays (O(m+n)), binary search for the correct
 * partition point. The partition divides both arrays into left and right halves
 * where left half size = (m+n+1)/2. The median is derived from the boundary elements.
 *
 * TIME: O(log(min(m,n))) — binary search on the shorter array
 * SPACE: O(1)
 */
public class MedianTwoSortedArrays {

    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Ensure nums1 is the shorter array
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.length, n = nums2.length;
        int left = 0, right = m;

        while (left <= right) {
            int partition1 = left + (right - left) / 2;
            int partition2 = (m + n + 1) / 2 - partition1;

            int maxLeft1 = (partition1 == 0) ? Integer.MIN_VALUE : nums1[partition1 - 1];
            int minRight1 = (partition1 == m) ? Integer.MAX_VALUE : nums1[partition1];
            int maxLeft2 = (partition2 == 0) ? Integer.MIN_VALUE : nums2[partition2 - 1];
            int minRight2 = (partition2 == n) ? Integer.MAX_VALUE : nums2[partition2];

            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                // Found the correct partition
                if ((m + n) % 2 == 0) {
                    return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;
                } else {
                    return Math.max(maxLeft1, maxLeft2);
                }
            } else if (maxLeft1 > minRight2) {
                right = partition1 - 1;
            } else {
                left = partition1 + 1;
            }
        }

        throw new IllegalArgumentException("Input arrays are not sorted");
    }
}
