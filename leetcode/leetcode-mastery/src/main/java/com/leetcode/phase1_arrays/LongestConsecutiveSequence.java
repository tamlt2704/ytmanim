package com.leetcode.phase1_arrays;

import java.util.HashSet;
import java.util.Set;

/**
 * LeetCode #128 - Longest Consecutive Sequence (Hard)
 *
 * PROBLEM: Given an unsorted array, find the length of the longest consecutive elements sequence.
 * Must run in O(n) time. Example: [100, 4, 200, 1, 3, 2] → 4 (sequence: [1, 2, 3, 4])
 *
 * PATTERN: Hash Set for O(1) Lookups + Sequence Start Detection
 *
 * APPROACH:
 * - Sorting would give O(n log n) — too slow
 * - Put all numbers in a HashSet
 * - For each number, check if it's the START of a sequence (num - 1 not in set)
 * - If it's a start, count consecutive numbers forward
 *
 * KEY INSIGHT: Only start counting from the beginning of a sequence.
 * If num-1 exists, skip it — it will be counted when we process the actual start.
 * This ensures each number is visited at most twice → O(n).
 *
 * TIME: O(n) — each number is visited at most twice (once in the loop, once in the while)
 * SPACE: O(n) — hash set
 */
public class LongestConsecutiveSequence {

    public int longestConsecutive(int[] nums) {
        Set<Integer> numSet = new HashSet<>();
        for (int n : nums) numSet.add(n);

        int longest = 0;

        for (int num : numSet) {
            // Only start counting if this is the beginning of a sequence
            if (!numSet.contains(num - 1)) {
                int current = num;
                int length = 1;

                while (numSet.contains(current + 1)) {
                    current++;
                    length++;
                }

                longest = Math.max(longest, length);
            }
        }

        return longest;
    }
}
