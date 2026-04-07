package com.leetcode.phase2_twopointers;

/**
 * LeetCode #125 - Valid Palindrome (Easy)
 *
 * PROBLEM: Given a string, determine if it's a palindrome considering only alphanumeric characters.
 *
 * PATTERN: Two Pointers (converging from both ends)
 *
 * APPROACH:
 * - Left pointer starts at 0, right pointer at end
 * - Skip non-alphanumeric characters
 * - Compare characters (case-insensitive)
 * - If mismatch → not a palindrome
 *
 * KEY INSIGHT: Two pointers converging from opposite ends is the natural way to check symmetry.
 * Skip non-relevant characters in-place instead of creating a cleaned string.
 *
 * TIME: O(n) — each character visited at most once
 * SPACE: O(1) — no extra space
 */
public class ValidPalindrome {

    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;

        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;

            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }

            left++;
            right--;
        }

        return true;
    }
}
