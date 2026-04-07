package com.leetcode.phase13_to_20;

import com.leetcode.phase13_trie.*;
import com.leetcode.phase14_unionfind.*;
import com.leetcode.phase15_bit.*;
import com.leetcode.phase16_math.*;
import com.leetcode.phase17_matrix.*;
import com.leetcode.phase18_design.*;
import com.leetcode.phase19_monotonic_queue.*;
import com.leetcode.phase20_string.*;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.*;

class Phase13to20Test {

    // === Phase 13: Trie ===
    @Test void trie_basic() {
        Trie t = new Trie();
        t.insert("apple");
        assertThat(t.search("apple")).isTrue();
        assertThat(t.search("app")).isFalse();
        assertThat(t.startsWith("app")).isTrue();
    }

    @Test void wordDict_wildcard() {
        WordDictionary wd = new WordDictionary();
        wd.addWord("bad"); wd.addWord("dad"); wd.addWord("mad");
        assertThat(wd.search(".ad")).isTrue();
        assertThat(wd.search("b..")).isTrue();
        assertThat(wd.search("b.d")).isTrue();
        assertThat(wd.search("..z")).isFalse();
    }

    // === Phase 14: Union Find ===
    @Test void components_basic() {
        var uf = new NumberOfConnectedComponents();
        assertThat(uf.countComponents(5, new int[][]{{0,1},{1,2},{3,4}})).isEqualTo(2);
    }
    @Test void components_single() {
        var uf = new NumberOfConnectedComponents();
        assertThat(uf.countComponents(5, new int[][]{{0,1},{1,2},{2,3},{3,4}})).isEqualTo(1);
    }

    @Test void redundant_basic() {
        var rc = new RedundantConnection();
        assertThat(rc.findRedundantConnection(new int[][]{{1,2},{1,3},{2,3}})).containsExactly(2, 3);
    }
    @Test void redundant_longer() {
        var rc = new RedundantConnection();
        assertThat(rc.findRedundantConnection(new int[][]{{1,2},{2,3},{3,4},{1,4},{1,5}})).containsExactly(1, 4);
    }

    // === Phase 15: Bit Manipulation ===
    @Test void singleNumber() { assertThat(new SingleNumber().singleNumber(new int[]{4,1,2,1,2})).isEqualTo(4); }
    @Test void countingBits() { assertThat(new CountingBits().countBits(5)).containsExactly(0,1,1,2,1,2); }
    @Test void reverseBits() { assertThat(new ReverseBits().reverseBits(0b00000010100101000001111010011100))
            .isEqualTo(0b00111001011110000010100101000000); }

    // === Phase 16: Math ===
    @Test void happyNumber_true() { assertThat(new HappyNumber().isHappy(19)).isTrue(); }
    @Test void happyNumber_false() { assertThat(new HappyNumber().isHappy(2)).isFalse(); }
    @Test void pow_positive() { assertThat(new Pow().myPow(2.0, 10)).isEqualTo(1024.0); }
    @Test void pow_negative() { assertThat(new Pow().myPow(2.0, -2)).isEqualTo(0.25); }

    // === Phase 17: Matrix ===
    @Test void spiral() {
        assertThat(new SpiralMatrix().spiralOrder(new int[][]{{1,2,3},{4,5,6},{7,8,9}}))
                .containsExactly(1,2,3,6,9,8,7,4,5);
    }
    @Test void rotate() {
        int[][] m = {{1,2,3},{4,5,6},{7,8,9}};
        new RotateImage().rotate(m);
        assertThat(m).isDeepEqualTo(new int[][]{{7,4,1},{8,5,2},{9,6,3}});
    }

    // === Phase 18: Design ===
    @Test void lruCache() {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 1); cache.put(2, 2);
        assertThat(cache.get(1)).isEqualTo(1);
        cache.put(3, 3); // evicts key 2
        assertThat(cache.get(2)).isEqualTo(-1);
        cache.put(4, 4); // evicts key 1
        assertThat(cache.get(1)).isEqualTo(-1);
        assertThat(cache.get(3)).isEqualTo(3);
    }

    @Test void minStack() {
        MinStack ms = new MinStack();
        ms.push(-2); ms.push(0); ms.push(-3);
        assertThat(ms.getMin()).isEqualTo(-3);
        ms.pop();
        assertThat(ms.top()).isEqualTo(0);
        assertThat(ms.getMin()).isEqualTo(-2);
    }

    // === Phase 19: Monotonic Queue ===
    @Test void slidingMax() {
        assertThat(new SlidingWindowMaximum().maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3))
                .containsExactly(3,3,5,5,6,7);
    }
    @Test void slidingMax_single() {
        assertThat(new SlidingWindowMaximum().maxSlidingWindow(new int[]{1}, 1)).containsExactly(1);
    }

    // === Phase 20: String ===
    @Test void longestPalindrome() {
        String result = new LongestPalindromicSubstring().longestPalindrome("babad");
        assertThat(result).isIn("bab", "aba");
    }
    @Test void longestPalindrome_even() {
        assertThat(new LongestPalindromicSubstring().longestPalindrome("cbbd")).isEqualTo("bb");
    }

    @Test void encodeDecode() {
        var ed = new EncodeDecodeStrings();
        List<String> input = List.of("hello", "world", "", "foo#bar");
        String encoded = ed.encode(input);
        assertThat(ed.decode(encoded)).containsExactlyElementsOf(input);
    }
}
