package com.leetcode.phase2_twopointers;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class Phase2Test {

    // --- Valid Palindrome ---
    private final ValidPalindrome vp = new ValidPalindrome();

    @Test void palindrome_basic() { assertThat(vp.isPalindrome("A man, a plan, a canal: Panama")).isTrue(); }
    @Test void palindrome_false() { assertThat(vp.isPalindrome("race a car")).isFalse(); }
    @Test void palindrome_empty() { assertThat(vp.isPalindrome(" ")).isTrue(); }

    // --- Longest Substring Without Repeating ---
    private final LongestSubstringWithoutRepeating ls = new LongestSubstringWithoutRepeating();

    @Test void longestSub_basic() { assertThat(ls.lengthOfLongestSubstring("abcabcbb")).isEqualTo(3); }
    @Test void longestSub_allSame() { assertThat(ls.lengthOfLongestSubstring("bbbbb")).isEqualTo(1); }
    @Test void longestSub_mixed() { assertThat(ls.lengthOfLongestSubstring("pwwkew")).isEqualTo(3); }
    @Test void longestSub_empty() { assertThat(ls.lengthOfLongestSubstring("")).isEqualTo(0); }

    // --- Minimum Window Substring ---
    private final MinimumWindowSubstring mws = new MinimumWindowSubstring();

    @Test void minWindow_basic() { assertThat(mws.minWindow("ADOBECODEBANC", "ABC")).isEqualTo("BANC"); }
    @Test void minWindow_exact() { assertThat(mws.minWindow("a", "a")).isEqualTo("a"); }
    @Test void minWindow_none() { assertThat(mws.minWindow("a", "aa")).isEmpty(); }
}
