package com.leetcode.phase5_linkedlist;

public class ListNode {
    public int val;
    public ListNode next;

    public ListNode(int val) { this.val = val; }
    public ListNode(int val, ListNode next) { this.val = val; this.next = next; }

    public static ListNode of(int... values) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        for (int v : values) {
            current.next = new ListNode(v);
            current = current.next;
        }
        return dummy.next;
    }

    public int[] toArray() {
        java.util.List<Integer> list = new java.util.ArrayList<>();
        ListNode curr = this;
        while (curr != null) { list.add(curr.val); curr = curr.next; }
        return list.stream().mapToInt(Integer::intValue).toArray();
    }
}
