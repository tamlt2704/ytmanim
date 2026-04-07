package com.leetcode.phase5_linkedlist;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class Phase5Test {

    // --- Reverse Linked List ---
    private final ReverseLinkedList rl = new ReverseLinkedList();

    @Test void reverse_basic() {
        assertThat(rl.reverseList(ListNode.of(1, 2, 3, 4, 5)).toArray()).containsExactly(5, 4, 3, 2, 1);
    }
    @Test void reverse_single() {
        assertThat(rl.reverseList(ListNode.of(1)).toArray()).containsExactly(1);
    }
    @Test void reverse_null() { assertThat(rl.reverseList(null)).isNull(); }

    // --- Merge K Sorted Lists ---
    private final MergeKSortedLists mk = new MergeKSortedLists();

    @Test void mergeK_basic() {
        ListNode[] lists = {ListNode.of(1, 4, 5), ListNode.of(1, 3, 4), ListNode.of(2, 6)};
        assertThat(mk.mergeKLists(lists).toArray()).containsExactly(1, 1, 2, 3, 4, 4, 5, 6);
    }
    @Test void mergeK_empty() { assertThat(mk.mergeKLists(new ListNode[]{})).isNull(); }
    @Test void mergeK_singleEmpty() { assertThat(mk.mergeKLists(new ListNode[]{null})).isNull(); }
}
