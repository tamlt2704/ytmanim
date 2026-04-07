package com.leetcode.phase11_greedy;

/**
 * LeetCode #55 - Jump Game (Medium)
 *
 * PROBLEM: Given an array where each element is the max jump length from that position,
 * determine if you can reach the last index.
 * Example: [2,3,1,1,4] → true, [3,2,1,0,4] → false
 *
 * PATTERN: Greedy — track the farthest reachable position
 *
 * APPROACH:
 * - Maintain a "maxReach" variable
 * - For each position i, if i > maxReach, we're stuck → return false
 * - Otherwise, update maxReach = max(maxReach, i + nums[i])
 *
 * KEY INSIGHT: You don't need to simulate every possible jump path.
 * Just track the farthest you can reach. If you can reach position i,
 * you can reach everything before it too.
 *
 * TIME: O(n), SPACE: O(1)
 */
public class JumpGame {

    public boolean canJump(int[] nums) {
        int maxReach = 0;

        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false; // can't reach this position
            maxReach = Math.max(maxReach, i + nums[i]);
        }

        return true;
    }
}
