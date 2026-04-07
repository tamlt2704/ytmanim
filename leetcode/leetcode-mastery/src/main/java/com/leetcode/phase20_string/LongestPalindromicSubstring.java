package com.leetcode.phase20_string;

/**
 * LeetCode #5 - Longest Palindromic Substring (Medium)
 *
 * PATTERN: Expand Around Center
 *
 * APPROACH:
 * - For each character (and each pair of characters), expand outward while palindrome
 * - Track the longest found
 *
 * KEY INSIGHT: A palindrome mirrors around its center. There are 2n-1 possible centers
 * (n single chars + n-1 pairs). Expanding from each center is O(n), total O(n²).
 *
 * TIME: O(n²), SPACE: O(1)
 */
public class LongestPalindromicSubstring {

    public String longestPalindrome(String s) {
        int start = 0, maxLen = 0;

        for (int i = 0; i < s.length(); i++) {
            int len1 = expand(s, i, i);     // odd length
            int len2 = expand(s, i, i + 1); // even length
            int len = Math.max(len1, len2);

            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }

        return s.substring(start, start + maxLen);
    }

    private int expand(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }
}
