package com.leetcode.phase16_math;

/**
 * LeetCode #50 - Pow(x, n) (Medium)
 *
 * PATTERN: Fast Exponentiation (Binary Exponentiation)
 *
 * KEY INSIGHT: x^n = (x^(n/2))^2 if n is even, x * (x^(n/2))^2 if n is odd.
 * This reduces O(n) multiplications to O(log n).
 *
 * TIME: O(log n), SPACE: O(log n) recursive, O(1) iterative
 */
public class Pow {
    public double myPow(double x, int n) {
        long N = n; // handle Integer.MIN_VALUE
        if (N < 0) { x = 1 / x; N = -N; }
        double result = 1;
        while (N > 0) {
            if ((N & 1) == 1) result *= x;
            x *= x;
            N >>= 1;
        }
        return result;
    }
}
