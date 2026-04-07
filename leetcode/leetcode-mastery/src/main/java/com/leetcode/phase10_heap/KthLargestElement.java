package com.leetcode.phase10_heap;

import java.util.PriorityQueue;

/**
 * LeetCode #215 - Kth Largest Element in an Array (Medium)
 *
 * PROBLEM: Find the kth largest element (not kth distinct).
 * Example: [3,2,1,5,6,4], k=2 → 5
 *
 * PATTERN: Min-Heap of Size K
 *
 * APPROACH:
 * - Maintain a min-heap of size k
 * - For each element, add to heap. If heap size > k, remove the smallest.
 * - After processing all elements, the heap top is the kth largest.
 *
 * KEY INSIGHT: A min-heap of size k always contains the k largest elements seen so far.
 * The smallest of those k elements (heap top) is the kth largest overall.
 *
 * Alternative: Quickselect (O(n) average, O(n²) worst)
 *
 * TIME: O(n log k)
 * SPACE: O(k)
 */
public class KthLargestElement {

    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll(); // remove smallest
            }
        }

        return minHeap.peek();
    }
}
