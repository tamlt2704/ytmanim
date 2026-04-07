package com.leetcode.phase7_dp;

/**
 * LeetCode #70 - Climbing Stairs (Easy)
 *
 * PROBLEM: You can climb 1 or 2 steps. How many distinct ways to reach step n?
 *
 * PATTERN: 1D DP (Fibonacci variant)
 *
 * KEY INSIGHT: dp[i] = dp[i-1] + dp[i-2]. You can reach step i from step i-1 (1 step)
 * or step i-2 (2 steps). This is literally the Fibonacci sequence.
 * Optimize space by keeping only the last two values.
 *
 * TIME: O(n), SPACE: O(1)
 */
public class ClimbingStairs {

    public int climbStairs(int n) {
        if (n <= 2) return n;

        int prev2 = 1; // ways to reach step 1
        int prev1 = 2; // ways to reach step 2

        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }

        return prev1;
    }
}
