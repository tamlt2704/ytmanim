package com.leetcode.phase18_design;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * LeetCode #155 - Min Stack (Medium)
 *
 * PATTERN: Two Stacks — main stack + min-tracking stack
 *
 * KEY INSIGHT: Push the current minimum onto the min stack alongside each element.
 * When you pop, pop from both. The min stack top always holds the current minimum.
 *
 * TIME: O(1) for all operations
 * SPACE: O(n)
 */
public class MinStack {

    private final Deque<Integer> stack = new ArrayDeque<>();
    private final Deque<Integer> minStack = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        int min = minStack.isEmpty() ? val : Math.min(val, minStack.peek());
        minStack.push(min);
    }

    public void pop() {
        stack.pop();
        minStack.pop();
    }

    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}
