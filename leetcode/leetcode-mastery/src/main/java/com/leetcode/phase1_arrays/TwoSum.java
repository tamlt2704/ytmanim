package com.leetcode.phase1_arrays;

import java.util.HashMap;
import java.util.Map;

/**
 * LeetCode #1 - Two Sum (Easy)
 *
 * PROBLEM: Given an array of integers and a target, return indices of two numbers that add up to target.
 *
 * PATTERN: Hash Map Complement Lookup
 *
 * APPROACH:
 * - Brute force: check every pair → O(n²)
 * - Optimal: for each number, check if (target - number) already exists in a map → O(n)
 *
 * KEY INSIGHT: Instead of searching forward for a complement, store what you've seen
 * and check if the current number IS someone else's complement.
 *
 * TIME: O(n) — single pass through the array
 * SPACE: O(n) — hash map stores up to n elements
 */
public class TwoSum {

    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // value → index

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }

            seen.put(nums[i], i);
        }

        return new int[]{}; // no solution found
    }
}
