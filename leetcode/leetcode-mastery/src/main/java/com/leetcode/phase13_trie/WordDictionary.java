package com.leetcode.phase13_trie;

/**
 * LeetCode #211 - Design Add and Search Words Data Structure (Medium)
 *
 * PATTERN: Trie + DFS for wildcard '.' matching
 *
 * KEY INSIGHT: '.' can match any character, so when we encounter it,
 * we DFS into ALL 26 children. Regular characters follow the normal trie path.
 *
 * TIME: O(m) for addWord, O(26^m) worst case for search with all dots (but rare)
 */
public class WordDictionary {

    private final TrieNode root = new TrieNode();

    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }

    public void addWord(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) node.children[idx] = new TrieNode();
            node = node.children[idx];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        return dfs(word, 0, root);
    }

    private boolean dfs(String word, int index, TrieNode node) {
        if (node == null) return false;
        if (index == word.length()) return node.isEnd;

        char c = word.charAt(index);
        if (c == '.') {
            for (TrieNode child : node.children) {
                if (dfs(word, index + 1, child)) return true;
            }
            return false;
        }
        return dfs(word, index + 1, node.children[c - 'a']);
    }
}
