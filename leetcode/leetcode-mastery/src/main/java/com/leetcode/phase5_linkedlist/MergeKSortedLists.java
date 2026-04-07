package com.leetcode.phase5_linkedlist;

import java.util.Comparator;
import java.util.PriorityQueue;

/**
 * LeetCode #23 - Merge K Sorted Lists (Hard)
 *
 * PROBLEM: Merge k sorted linked lists into one sorted list.
 *
 * PATTERN: Min-Heap (Priority Queue)
 *
 * APPROACH:
 * - Add the head of each list to a min-heap
 * - Pop the smallest, add it to the result, push its next node
 * - Repeat until heap is empty
 *
 * KEY INSIGHT: The heap always contains at most k elements (one per list),
 * so each insert/remove is O(log k). Total: O(n log k) where n = total nodes.
 *
 * Alternative: Divide and conquer (merge pairs) → also O(n log k)
 *
 * TIME: O(n log k), SPACE: O(k)
 */
public class MergeKSortedLists {

    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;

        PriorityQueue<ListNode> heap = new PriorityQueue<>(Comparator.comparingInt(a -> a.val));

        for (ListNode head : lists) {
            if (head != null) heap.offer(head);
        }

        ListNode dummy = new ListNode(0);
        ListNode current = dummy;

        while (!heap.isEmpty()) {
            ListNode smallest = heap.poll();
            current.next = smallest;
            current = current.next;

            if (smallest.next != null) {
                heap.offer(smallest.next);
            }
        }

        return dummy.next;
    }
}
