package com.leetcode.phase12_intervals;

import java.util.Arrays;
import java.util.Comparator;

/**
 * LeetCode #435 - Non-overlapping Intervals (Medium)
 *
 * PROBLEM: Given intervals, find the minimum number of intervals to remove to make the rest non-overlapping.
 * Example: [[1,2],[2,3],[3,4],[1,3]] → 1 (remove [1,3])
 *
 * PATTERN: Greedy — sort by end time, keep the interval that ends earliest
 *
 * APPROACH:
 * - Sort by end time
 * - Greedily keep intervals that don't overlap with the last kept one
 * - Count removals = total - kept
 *
 * KEY INSIGHT: Sorting by end time and always keeping the earliest-ending interval
 * maximizes room for future intervals. This is the classic interval scheduling greedy proof.
 *
 * TIME: O(n log n), SPACE: O(1)
 */
public class NonOverlappingIntervals {

    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length <= 1) return 0;

        Arrays.sort(intervals, Comparator.comparingInt(a -> a[1])); // sort by end

        int kept = 1;
        int lastEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= lastEnd) { // no overlap
                kept++;
                lastEnd = intervals[i][1];
            }
        }

        return intervals.length - kept;
    }
}
