package com.leetcode.phase19_monotonic_queue;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * LeetCode #239 - Sliding Window Maximum (Hard)
 *
 * PROBLEM: Given an array and window size k, return the max of each window.
 *
 * PATTERN: Monotonic Decreasing Deque
 *
 * APPROACH:
 * - Maintain a deque of indices in decreasing order of their values
 * - Front of deque = index of current window maximum
 * - Remove from back if new element is larger (they'll never be the max)
 * - Remove from front if index is outside the window
 *
 * KEY INSIGHT: The deque stores "candidates" for window maximum. Elements smaller than
 * the new element can never be the maximum while the new element is in the window,
 * so we discard them.
 *
 * TIME: O(n) — each element added/removed from deque at most once
 * SPACE: O(k)
 */
public class SlidingWindowMaximum {

    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>(); // indices

        for (int i = 0; i < n; i++) {
            // Remove indices outside the window
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }
            // Remove smaller elements from back
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                deque.pollLast();
            }
            deque.offerLast(i);

            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }
        return result;
    }
}
