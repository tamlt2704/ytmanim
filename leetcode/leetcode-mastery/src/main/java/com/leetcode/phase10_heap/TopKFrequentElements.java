package com.leetcode.phase10_heap;

import java.util.*;

/**
 * LeetCode #347 - Top K Frequent Elements (Medium)
 *
 * PROBLEM: Given an integer array, return the k most frequent elements.
 * Example: [1,1,1,2,2,3], k=2 → [1,2]
 *
 * PATTERN: Frequency Map + Min-Heap (or Bucket Sort for O(n))
 *
 * APPROACH (Heap):
 * - Count frequencies with a HashMap
 * - Use a min-heap of size k, ordered by frequency
 * - After processing, heap contains the k most frequent elements
 *
 * APPROACH (Bucket Sort — optimal):
 * - Count frequencies, then create buckets where index = frequency
 * - Walk buckets from highest frequency down, collect k elements
 *
 * TIME: O(n) with bucket sort, O(n log k) with heap
 * SPACE: O(n)
 */
public class TopKFrequentElements {

    @SuppressWarnings("unchecked")
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);

        // Bucket sort: index = frequency, value = list of numbers with that frequency
        List<Integer>[] buckets = new List[nums.length + 1];
        for (var entry : freq.entrySet()) {
            int f = entry.getValue();
            if (buckets[f] == null) buckets[f] = new ArrayList<>();
            buckets[f].add(entry.getKey());
        }

        int[] result = new int[k];
        int idx = 0;
        for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
            if (buckets[i] != null) {
                for (int num : buckets[i]) {
                    if (idx < k) result[idx++] = num;
                }
            }
        }

        return result;
    }
}
