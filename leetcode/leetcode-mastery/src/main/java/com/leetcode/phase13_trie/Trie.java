package com.leetcode.phase13_trie;

/**
 * LeetCode #208 - Implement Trie (Medium)
 *
 * PATTERN: Prefix Tree — each node has 26 children (one per letter)
 *
 * KEY INSIGHT: A trie stores strings character by character. Shared prefixes share nodes.
 * insert/search/startsWith are all O(m) where m = word length.
 *
 * TIME: O(m) per operation, SPACE: O(total characters across all words)
 */
public class Trie {

    private final TrieNode root = new TrieNode();

    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) node.children[idx] = new TrieNode();
            node = node.children[idx];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = findNode(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return findNode(prefix) != null;
    }

    private TrieNode findNode(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            node = node.children[c - 'a'];
            if (node == null) return null;
        }
        return node;
    }
}
