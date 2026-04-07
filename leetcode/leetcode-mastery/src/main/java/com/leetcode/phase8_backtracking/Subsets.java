package com.leetcode.phase8_backtracking;

import java.util.ArrayList;
import java.util.List;

/**
 * LeetCode #78 - Subsets (Medium — but the easiest backtracking problem)
 *
 * PROBLEM: Given a set of distinct integers, return all possible subsets.
 *
 * PATTERN: Backtracking Template — choose, explore, unchoose
 *
 * KEY INSIGHT: For each element, you have two choices: include it or skip it.
 * The decision tree has 2^n leaves = 2^n subsets.
 *
 * TIME: O(n * 2^n) — 2^n subsets, each takes O(n) to copy
 * SPACE: O(n) — recursion depth
 */
public class Subsets {

    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current)); // add a copy of current subset

        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);                          // choose
            backtrack(nums, i + 1, current, result);       // explore
            current.remove(current.size() - 1);            // unchoose (backtrack)
        }
    }
}
