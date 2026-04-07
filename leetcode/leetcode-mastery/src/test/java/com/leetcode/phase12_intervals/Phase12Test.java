package com.leetcode.phase12_intervals;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class Phase12Test {

    private final MergeIntervals mi = new MergeIntervals();

    @Test void merge_basic() {
        assertThat(mi.merge(new int[][]{{1,3},{2,6},{8,10},{15,18}}))
                .isDeepEqualTo(new int[][]{{1,6},{8,10},{15,18}});
    }
    @Test void merge_overlap() {
        assertThat(mi.merge(new int[][]{{1,4},{4,5}}))
                .isDeepEqualTo(new int[][]{{1,5}});
    }
    @Test void merge_single() {
        assertThat(mi.merge(new int[][]{{1,2}})).isDeepEqualTo(new int[][]{{1,2}});
    }

    private final NonOverlappingIntervals noi = new NonOverlappingIntervals();

    @Test void erase_basic() {
        assertThat(noi.eraseOverlapIntervals(new int[][]{{1,2},{2,3},{3,4},{1,3}})).isEqualTo(1);
    }
    @Test void erase_allOverlap() {
        assertThat(noi.eraseOverlapIntervals(new int[][]{{1,2},{1,2},{1,2}})).isEqualTo(2);
    }
    @Test void erase_none() {
        assertThat(noi.eraseOverlapIntervals(new int[][]{{1,2},{2,3}})).isEqualTo(0);
    }
}
