package com.leetcode.phase3_stack;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * LeetCode #739 - Daily Temperatures (Medium)
 *
 * PROBLEM: Given daily temperatures, return an array where answer[i] is the number of days
 * you have to wait for a warmer temperature. If no future day is warmer, answer[i] = 0.
 * Example: [73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]
 *
 * PATTERN: Monotonic Decreasing Stack
 *
 * APPROACH:
 * - Maintain a stack of indices where temperatures are in decreasing order
 * - For each new temperature, pop all stack entries that are cooler
 * - The difference in indices gives the "days to wait"
 *
 * KEY INSIGHT: A monotonic stack efficiently finds the "next greater element" for each position.
 * When we pop an index from the stack, the current index IS the next warmer day for that popped index.
 *
 * TIME: O(n) — each index pushed and popped at most once
 * SPACE: O(n) — stack
 */
public class DailyTemperatures {

    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] result = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // stores indices

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int prevIndex = stack.pop();
                result[prevIndex] = i - prevIndex;
            }
            stack.push(i);
        }

        return result; // remaining indices in stack have no warmer day → default 0
    }
}
