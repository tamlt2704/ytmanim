package com.leetcode.phase3_stack;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class Phase3Test {

    // --- Valid Parentheses ---
    private final ValidParentheses vp = new ValidParentheses();

    @Test void parens_valid() { assertThat(vp.isValid("()[]{}")).isTrue(); }
    @Test void parens_nested() { assertThat(vp.isValid("{[]}")).isTrue(); }
    @Test void parens_invalid() { assertThat(vp.isValid("(]")).isFalse(); }
    @Test void parens_unclosed() { assertThat(vp.isValid("(")).isFalse(); }

    // --- Daily Temperatures ---
    private final DailyTemperatures dt = new DailyTemperatures();

    @Test void temps_basic() {
        assertThat(dt.dailyTemperatures(new int[]{73, 74, 75, 71, 69, 72, 76, 73}))
                .containsExactly(1, 1, 4, 2, 1, 1, 0, 0);
    }
    @Test void temps_decreasing() {
        assertThat(dt.dailyTemperatures(new int[]{30, 20, 10})).containsExactly(0, 0, 0);
    }

    // --- Largest Rectangle in Histogram ---
    private final LargestRectangleHistogram lrh = new LargestRectangleHistogram();

    @Test void histogram_basic() { assertThat(lrh.largestRectangleArea(new int[]{2, 1, 5, 6, 2, 3})).isEqualTo(10); }
    @Test void histogram_single() { assertThat(lrh.largestRectangleArea(new int[]{2, 4})).isEqualTo(4); }
    @Test void histogram_uniform() { assertThat(lrh.largestRectangleArea(new int[]{3, 3, 3})).isEqualTo(9); }
}
