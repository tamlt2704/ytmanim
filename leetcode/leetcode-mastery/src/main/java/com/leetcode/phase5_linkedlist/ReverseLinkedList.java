package com.leetcode.phase5_linkedlist;

/**
 * LeetCode #206 - Reverse Linked List (Easy)
 *
 * PATTERN: Three-pointer iteration (prev, current, next)
 *
 * KEY INSIGHT: At each step, save next, reverse the pointer, advance both pointers.
 * prev starts as null (new tail), current starts at head.
 *
 * TIME: O(n), SPACE: O(1)
 */
public class ReverseLinkedList {

    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode current = head;

        while (current != null) {
            ListNode next = current.next; // save
            current.next = prev;          // reverse
            prev = current;               // advance
            current = next;
        }

        return prev;
    }
}
