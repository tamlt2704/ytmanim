package com.leetcode.phase15_bit;

/**
 * LeetCode #190 - Reverse Bits (Easy)
 *
 * PATTERN: Bit-by-bit extraction and placement
 *
 * KEY INSIGHT: Extract the last bit of n (n & 1), place it at position (31 - i) in result.
 * Shift n right each iteration.
 *
 * TIME: O(32) = O(1), SPACE: O(1)
 */
public class ReverseBits {
    public int reverseBits(int n) {
        int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1);
            n >>= 1;
        }
        return result;
    }
}
