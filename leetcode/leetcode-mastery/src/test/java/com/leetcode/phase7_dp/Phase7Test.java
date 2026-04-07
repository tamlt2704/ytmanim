package com.leetcode.phase7_dp;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class Phase7Test {

    // --- Climbing Stairs ---
    private final ClimbingStairs cs = new ClimbingStairs();

    @Test void stairs_2() { assertThat(cs.climbStairs(2)).isEqualTo(2); }
    @Test void stairs_3() { assertThat(cs.climbStairs(3)).isEqualTo(3); }
    @Test void stairs_5() { assertThat(cs.climbStairs(5)).isEqualTo(8); }

    // --- Longest Increasing Subsequence ---
    private final LongestIncreasingSubsequence lis = new LongestIncreasingSubsequence();

    @Test void lis_basic() { assertThat(lis.lengthOfLIS(new int[]{10, 9, 2, 5, 3, 7, 101, 18})).isEqualTo(4); }
    @Test void lis_increasing() { assertThat(lis.lengthOfLIS(new int[]{1, 2, 3, 4, 5})).isEqualTo(5); }
    @Test void lis_decreasing() { assertThat(lis.lengthOfLIS(new int[]{5, 4, 3, 2, 1})).isEqualTo(1); }

    // --- Edit Distance ---
    private final EditDistance ed = new EditDistance();

    @Test void edit_basic() { assertThat(ed.minDistance("horse", "ros")).isEqualTo(3); }
    @Test void edit_longer() { assertThat(ed.minDistance("intention", "execution")).isEqualTo(5); }
    @Test void edit_empty() { assertThat(ed.minDistance("", "abc")).isEqualTo(3); }
    @Test void edit_same() { assertThat(ed.minDistance("abc", "abc")).isEqualTo(0); }
}
