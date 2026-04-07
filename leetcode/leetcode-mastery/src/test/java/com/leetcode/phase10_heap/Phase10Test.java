package com.leetcode.phase10_heap;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class Phase10Test {

    private final KthLargestElement kth = new KthLargestElement();

    @Test void kth_basic() { assertThat(kth.findKthLargest(new int[]{3,2,1,5,6,4}, 2)).isEqualTo(5); }
    @Test void kth_duplicates() { assertThat(kth.findKthLargest(new int[]{3,2,3,1,2,4,5,5,6}, 4)).isEqualTo(4); }

    private final TopKFrequentElements topK = new TopKFrequentElements();

    @Test void topK_basic() {
        assertThat(topK.topKFrequent(new int[]{1,1,1,2,2,3}, 2)).containsExactlyInAnyOrder(1, 2);
    }
    @Test void topK_single() {
        assertThat(topK.topKFrequent(new int[]{1}, 1)).containsExactly(1);
    }

    @Test void median_stream() {
        FindMedianFromDataStream m = new FindMedianFromDataStream();
        m.addNum(1);
        m.addNum(2);
        assertThat(m.findMedian()).isEqualTo(1.5);
        m.addNum(3);
        assertThat(m.findMedian()).isEqualTo(2.0);
    }

    @Test void median_single() {
        FindMedianFromDataStream m = new FindMedianFromDataStream();
        m.addNum(5);
        assertThat(m.findMedian()).isEqualTo(5.0);
    }
}
