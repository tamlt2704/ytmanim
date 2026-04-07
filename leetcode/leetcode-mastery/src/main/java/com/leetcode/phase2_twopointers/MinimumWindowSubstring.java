package com.leetcode.phase2_twopointers;

import java.util.HashMap;
import java.util.Map;

/**
 * LeetCode #76 - Minimum Window Substring (Hard)
 *
 * PROBLEM: Given strings s and t, find the minimum window in s that contains all characters of t.
 * Example: s = "ADOBECODEBANC", t = "ABC" → "BANC"
 *
 * PATTERN: Sliding Window with Frequency Map + "Formed" Counter
 *
 * APPROACH:
 * 1. Count character frequencies in t (the "need" map)
 * 2. Expand window by moving right pointer
 * 3. When a character's count in the window matches the need, increment "formed"
 * 4. When formed == unique chars needed, try shrinking from left
 * 5. Track the minimum valid window
 *
 * KEY INSIGHT: Use a "formed" counter to track how many unique characters have met
 * their required frequency. This avoids re-checking all frequencies on every step.
 * Only update "formed" when a character's count crosses the threshold.
 *
 * TIME: O(|s| + |t|) — each character in s visited at most twice (once by right, once by left)
 * SPACE: O(|s| + |t|) — two frequency maps
 */
public class MinimumWindowSubstring {

    public String minWindow(String s, String t) {
        if (s.isEmpty() || t.isEmpty()) return "";

        // Count required characters
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.merge(c, 1, Integer::sum);
        }

        int required = need.size(); // unique chars that must be satisfied
        int formed = 0;             // unique chars currently satisfied

        Map<Character, Integer> windowCounts = new HashMap<>();
        int[] result = {-1, 0, 0}; // {length, left, right}
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            windowCounts.merge(c, 1, Integer::sum);

            // Check if this character's frequency is now satisfied
            if (need.containsKey(c) && windowCounts.get(c).intValue() == need.get(c).intValue()) {
                formed++;
            }

            // Try to shrink the window
            while (left <= right && formed == required) {
                int windowLen = right - left + 1;
                if (result[0] == -1 || windowLen < result[0]) {
                    result[0] = windowLen;
                    result[1] = left;
                    result[2] = right;
                }

                // Remove left character from window
                char leftChar = s.charAt(left);
                windowCounts.merge(leftChar, -1, Integer::sum);

                if (need.containsKey(leftChar) && windowCounts.get(leftChar) < need.get(leftChar)) {
                    formed--;
                }

                left++;
            }
        }

        return result[0] == -1 ? "" : s.substring(result[1], result[2] + 1);
    }
}
