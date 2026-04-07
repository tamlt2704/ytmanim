package com.leetcode.phase3_stack;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;

/**
 * LeetCode #20 - Valid Parentheses (Easy)
 *
 * PROBLEM: Given a string containing '(', ')', '{', '}', '[', ']', determine if it's valid.
 *
 * PATTERN: Stack for Matching Pairs
 *
 * APPROACH:
 * - Push opening brackets onto the stack
 * - For closing brackets, check if the top of stack is the matching opener
 * - If mismatch or stack empty → invalid
 * - At the end, stack must be empty
 *
 * KEY INSIGHT: A stack naturally handles nested structures. The most recent unmatched
 * opening bracket is always on top — exactly what we need to match against.
 *
 * TIME: O(n)
 * SPACE: O(n) — stack can hold up to n/2 opening brackets
 */
public class ValidParentheses {

    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> pairs = Map.of(')', '(', '}', '{', ']', '[');

        for (char c : s.toCharArray()) {
            if (pairs.containsValue(c)) {
                stack.push(c); // opening bracket
            } else if (pairs.containsKey(c)) {
                if (stack.isEmpty() || stack.pop() != pairs.get(c)) {
                    return false;
                }
            }
        }

        return stack.isEmpty();
    }
}
