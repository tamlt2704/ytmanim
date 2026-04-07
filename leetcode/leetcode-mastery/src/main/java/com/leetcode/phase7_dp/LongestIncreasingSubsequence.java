package com.leetcode.phase7_dp;

import java.util.Arrays;

/**
 * LeetCode #300 - Longest Increasing Subsequence (Medium)
 *
 * PROBLEM: Find the length of the longest strictly increasing subsequence.
 * Example: [10,9,2,5,3,7,101,18] → 4 ([2,3,7,101])
 *
 * PATTERN: 1D DP — dp[i] = length of LIS ending at index i
 *
 * APPROACH:
 * - For each element, check all previous elements
 * - If nums[j] < nums[i], we can extend the subsequence ending at j
 * - dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]
 *
 * KEY INSIGHT: The LIS ending at each position depends on all previous LIS values.
 * This is O(n²). There's an O(n log n) solution using patience sorting (binary search
 * on a "tails" array), but the DP version is the foundation to understand first.
 *
 * TIME: O(n²), SPACE: O(n)
 */
public class LongestIncreasingSubsequence {

    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1); // each element is a subsequence of length 1

        int maxLen = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            maxLen = Math.max(maxLen, dp[i]);
        }

        return maxLen;
    }
}
