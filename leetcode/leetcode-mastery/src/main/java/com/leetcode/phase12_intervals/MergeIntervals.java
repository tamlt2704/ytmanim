package com.leetcode.phase12_intervals;

import java.util.*;

/**
 * LeetCode #56 - Merge Intervals (Medium)
 *
 * PROBLEM: Given a collection of intervals, merge all overlapping intervals.
 * Example: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]
 *
 * PATTERN: Sort by Start + Linear Merge
 *
 * APPROACH:
 * - Sort intervals by start time
 * - Iterate: if current interval overlaps with the last merged one, extend it
 * - Otherwise, add current as a new interval
 *
 * KEY INSIGHT: After sorting by start, two intervals overlap if and only if
 * current.start ≤ previous.end. When they overlap, merge by taking max of both ends.
 *
 * TIME: O(n log n) — sorting dominates
 * SPACE: O(n) — result list
 */
public class MergeIntervals {

    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;

        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));

        List<int[]> merged = new ArrayList<>();
        merged.add(intervals[0]);

        for (int i = 1; i < intervals.length; i++) {
            int[] last = merged.get(merged.size() - 1);

            if (intervals[i][0] <= last[1]) {
                last[1] = Math.max(last[1], intervals[i][1]); // extend
            } else {
                merged.add(intervals[i]); // no overlap
            }
        }

        return merged.toArray(new int[0][]);
    }
}
