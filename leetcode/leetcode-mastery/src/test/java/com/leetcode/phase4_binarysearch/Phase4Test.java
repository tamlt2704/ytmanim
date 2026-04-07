package com.leetcode.phase4_binarysearch;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class Phase4Test {

    // --- Binary Search ---
    private final BinarySearch bs = new BinarySearch();

    @Test void bs_found() { assertThat(bs.search(new int[]{-1, 0, 3, 5, 9, 12}, 9)).isEqualTo(4); }
    @Test void bs_notFound() { assertThat(bs.search(new int[]{-1, 0, 3, 5, 9, 12}, 2)).isEqualTo(-1); }
    @Test void bs_single() { assertThat(bs.search(new int[]{5}, 5)).isEqualTo(0); }

    // --- Search Rotated Array ---
    private final SearchRotatedArray sra = new SearchRotatedArray();

    @Test void rotated_found() { assertThat(sra.search(new int[]{4, 5, 6, 7, 0, 1, 2}, 0)).isEqualTo(4); }
    @Test void rotated_notFound() { assertThat(sra.search(new int[]{4, 5, 6, 7, 0, 1, 2}, 3)).isEqualTo(-1); }
    @Test void rotated_single() { assertThat(sra.search(new int[]{1}, 0)).isEqualTo(-1); }

    // --- Median of Two Sorted Arrays ---
    private final MedianTwoSortedArrays m = new MedianTwoSortedArrays();

    @Test void median_odd() { assertThat(m.findMedianSortedArrays(new int[]{1, 3}, new int[]{2})).isEqualTo(2.0); }
    @Test void median_even() { assertThat(m.findMedianSortedArrays(new int[]{1, 2}, new int[]{3, 4})).isEqualTo(2.5); }
    @Test void median_empty() { assertThat(m.findMedianSortedArrays(new int[]{}, new int[]{1})).isEqualTo(1.0); }
}
