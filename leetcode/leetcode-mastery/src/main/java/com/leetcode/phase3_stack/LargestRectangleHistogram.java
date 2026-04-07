package com.leetcode.phase3_stack;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * LeetCode #84 - Largest Rectangle in Histogram (Hard)
 *
 * PROBLEM: Given an array of bar heights, find the area of the largest rectangle in the histogram.
 * Example: [2,1,5,6,2,3] → 10 (bars at index 2,3 with height 5, width 2)
 *
 * PATTERN: Monotonic Increasing Stack
 *
 * APPROACH:
 * - Maintain a stack of indices in increasing height order
 * - When a shorter bar is encountered, pop and calculate area
 * - The popped bar's width extends from the current stack top to the current index
 * - After processing all bars, pop remaining entries
 *
 * KEY INSIGHT: For each bar, we need to know how far left and right it can extend
 * (i.e., the nearest shorter bar on each side). The monotonic stack gives us both
 * boundaries efficiently. When we pop bar[i], the current index is the right boundary
 * and the new stack top is the left boundary.
 *
 * TIME: O(n) — each bar pushed and popped at most once
 * SPACE: O(n) — stack
 */
public class LargestRectangleHistogram {

    public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;
        int n = heights.length;

        for (int i = 0; i <= n; i++) {
            int currentHeight = (i == n) ? 0 : heights[i]; // sentinel: 0 at the end forces all pops

            while (!stack.isEmpty() && currentHeight < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }

            stack.push(i);
        }

        return maxArea;
    }
}
