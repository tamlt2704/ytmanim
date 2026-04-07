package com.leetcode.phase15_bit;

/**
 * LeetCode #136 - Single Number (Easy)
 *
 * PROBLEM: Every element appears twice except one. Find it.
 *
 * PATTERN: XOR — a ^ a = 0, a ^ 0 = a
 *
 * KEY INSIGHT: XOR all numbers. Pairs cancel out (a ^ a = 0), leaving the single number.
 *
 * TIME: O(n), SPACE: O(1)
 */
public class SingleNumber {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int n : nums) result ^= n;
        return result;
    }
}
