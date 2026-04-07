package com.leetcode.phase10_heap;

import java.util.Collections;
import java.util.PriorityQueue;

/**
 * LeetCode #295 - Find Median from Data Stream (Hard)
 *
 * PROBLEM: Design a data structure that supports addNum(int) and findMedian() efficiently.
 *
 * PATTERN: Two Heaps (Max-Heap for left half, Min-Heap for right half)
 *
 * APPROACH:
 * - maxHeap stores the smaller half (top = largest of the small half)
 * - minHeap stores the larger half (top = smallest of the large half)
 * - Keep them balanced: maxHeap.size() == minHeap.size() or maxHeap.size() == minHeap.size() + 1
 * - Median = maxHeap.peek() (odd count) or average of both tops (even count)
 *
 * KEY INSIGHT: The two heaps maintain a sorted partition of all numbers.
 * The median is always at the boundary between the two heaps.
 *
 * TIME: O(log n) per addNum, O(1) per findMedian
 * SPACE: O(n)
 */
public class FindMedianFromDataStream {

    private final PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder()); // left half
    private final PriorityQueue<Integer> minHeap = new PriorityQueue<>(); // right half

    public void addNum(int num) {
        maxHeap.offer(num);

        // Ensure maxHeap top ≤ minHeap top
        if (!minHeap.isEmpty() && maxHeap.peek() > minHeap.peek()) {
            minHeap.offer(maxHeap.poll());
        }

        // Balance sizes: maxHeap can have at most 1 more element
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.offer(maxHeap.poll());
        } else if (minHeap.size() > maxHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }

    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek();
        }
        return (maxHeap.peek() + minHeap.peek()) / 2.0;
    }
}
