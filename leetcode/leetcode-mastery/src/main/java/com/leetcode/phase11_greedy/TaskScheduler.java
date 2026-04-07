package com.leetcode.phase11_greedy;

import java.util.Arrays;

/**
 * LeetCode #621 - Task Scheduler (Medium)
 *
 * PROBLEM: Given tasks and a cooldown period n, find the minimum time to execute all tasks.
 * Same tasks must be separated by at least n intervals.
 * Example: tasks = ["A","A","A","B","B","B"], n = 2 → 8 (A B idle A B idle A B)
 *
 * PATTERN: Greedy — schedule the most frequent task first
 *
 * APPROACH:
 * - Count frequency of each task
 * - The most frequent task determines the frame: (maxFreq - 1) * (n + 1) + countOfMaxFreq
 * - If total tasks > frame size, answer is just tasks.length (no idle needed)
 *
 * KEY INSIGHT: Think of it as filling slots. The most frequent task creates (maxFreq-1) gaps
 * of size n. Other tasks fill those gaps. If all gaps are filled, no idle time needed.
 *
 * TIME: O(n), SPACE: O(1) — 26 letters max
 */
public class TaskScheduler {

    public int leastInterval(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char t : tasks) freq[t - 'A']++;

        Arrays.sort(freq);
        int maxFreq = freq[25];

        // Count how many tasks share the max frequency
        int maxCount = 0;
        for (int f : freq) {
            if (f == maxFreq) maxCount++;
        }

        // Frame: (maxFreq - 1) chunks of size (n + 1), plus the last partial chunk
        int minTime = (maxFreq - 1) * (n + 1) + maxCount;

        // If we have more tasks than frame slots, no idle needed
        return Math.max(minTime, tasks.length);
    }
}
