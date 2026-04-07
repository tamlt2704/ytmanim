package com.leetcode.phase1_arrays;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class Phase1Test {

    // --- Two Sum ---
    private final TwoSum twoSum = new TwoSum();

    @Test void twoSum_basic() { assertThat(twoSum.twoSum(new int[]{2, 7, 11, 15}, 9)).containsExactly(0, 1); }
    @Test void twoSum_middle() { assertThat(twoSum.twoSum(new int[]{3, 2, 4}, 6)).containsExactly(1, 2); }
    @Test void twoSum_same() { assertThat(twoSum.twoSum(new int[]{3, 3}, 6)).containsExactly(0, 1); }

    // --- Group Anagrams ---
    private final GroupAnagrams ga = new GroupAnagrams();

    @Test void groupAnagrams_basic() {
        var result = ga.groupAnagrams(new String[]{"eat", "tea", "tan", "ate", "nat", "bat"});
        assertThat(result).hasSize(3);
    }
    @Test void groupAnagrams_empty() {
        var result = ga.groupAnagrams(new String[]{""});
        assertThat(result).hasSize(1);
    }
    @Test void groupAnagrams_single() {
        var result = ga.groupAnagrams(new String[]{"a"});
        assertThat(result).hasSize(1).first().asList().containsExactly("a");
    }

    // --- Longest Consecutive Sequence ---
    private final LongestConsecutiveSequence lcs = new LongestConsecutiveSequence();

    @Test void lcs_basic() { assertThat(lcs.longestConsecutive(new int[]{100, 4, 200, 1, 3, 2})).isEqualTo(4); }
    @Test void lcs_empty() { assertThat(lcs.longestConsecutive(new int[]{})).isEqualTo(0); }
    @Test void lcs_duplicates() { assertThat(lcs.longestConsecutive(new int[]{0, 3, 7, 2, 5, 8, 4, 6, 0, 1})).isEqualTo(9); }
}
