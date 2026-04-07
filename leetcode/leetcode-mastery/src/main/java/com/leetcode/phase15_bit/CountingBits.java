package com.leetcode.phase15_bit;

/**
 * LeetCode #338 - Counting Bits (Easy)
 *
 * PROBLEM: For every number 0 to n, count the number of 1-bits.
 *
 * PATTERN: DP on Bits — dp[i] = dp[i >> 1] + (i & 1)
 *
 * KEY INSIGHT: The number of 1-bits in i equals the number of 1-bits in i/2
 * (right shift removes the last bit) plus the last bit itself (i & 1).
 *
 * TIME: O(n), SPACE: O(n)
 */
public class CountingBits {
    public int[] countBits(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            dp[i] = dp[i >> 1] + (i & 1);
        }
        return dp;
    }
}
