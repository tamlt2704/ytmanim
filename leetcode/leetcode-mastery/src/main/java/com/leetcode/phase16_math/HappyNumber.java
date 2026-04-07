package com.leetcode.phase16_math;

import java.util.HashSet;
import java.util.Set;

/**
 * LeetCode #202 - Happy Number (Easy)
 *
 * PROBLEM: Replace number by sum of squares of its digits. If it reaches 1, it's happy.
 * If it loops endlessly, it's not.
 *
 * PATTERN: Cycle Detection (Floyd's or HashSet)
 *
 * KEY INSIGHT: The sequence either reaches 1 or enters a cycle. Use a set to detect the cycle,
 * or use Floyd's slow/fast pointer (same as linked list cycle detection).
 *
 * TIME: O(log n), SPACE: O(log n) with set, O(1) with Floyd's
 */
public class HappyNumber {
    public boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();
        while (n != 1 && !seen.contains(n)) {
            seen.add(n);
            n = sumOfSquares(n);
        }
        return n == 1;
    }

    private int sumOfSquares(int n) {
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        return sum;
    }
}
