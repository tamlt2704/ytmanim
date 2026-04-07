package com.leetcode.phase2_twopointers;

import java.util.HashMap;
import java.util.Map;

/**
 * LeetCode #3 - Longest Substring Without Repeating Characters (Medium)
 *
 * PROBLEM: Find the length of the longest substring without repeating characters.
 * Example: "abcabcbb" → 3 ("abc")
 *
 * PATTERN: Sliding Window with Hash Map
 *
 * APPROACH:
 * - Maintain a window [left, right] that contains no duplicates
 * - Expand right pointer, adding characters to a map (char → last index)
 * - When a duplicate is found, shrink left pointer past the previous occurrence
 * - Track the maximum window size
 *
 * KEY INSIGHT: When you find a duplicate at position right, you don't need to shrink
 * one step at a time. Jump left directly to (previous occurrence + 1).
 * The map stores the last seen index of each character for this jump.
 *
 * TIME: O(n) — each character visited at most once by right pointer
 * SPACE: O(min(n, 26)) — map stores at most 26 lowercase letters (or charset size)
 */
public class LongestSubstringWithoutRepeating {

    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);

            if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
                left = lastSeen.get(c) + 1; // jump past the duplicate
            }

            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }
}
