package com.leetcode.phase9_graphs;

import java.util.*;

/**
 * LeetCode #127 - Word Ladder (Hard)
 *
 * PROBLEM: Given beginWord, endWord, and a wordList, find the shortest transformation sequence
 * where each step changes exactly one letter. Return the number of words in the sequence.
 * Example: "hit" → "hot" → "dot" → "dog" → "cog" = 5
 *
 * PATTERN: BFS for Shortest Path in Unweighted Graph
 *
 * APPROACH:
 * - Each word is a node, edges connect words that differ by one letter
 * - BFS from beginWord finds the shortest path to endWord
 * - Optimization: for each word, try all 26 letter substitutions at each position
 *   instead of comparing every pair of words
 *
 * KEY INSIGHT: BFS guarantees shortest path in an unweighted graph. The "graph" is implicit —
 * we generate neighbors on the fly by trying all single-character mutations.
 *
 * TIME: O(M² * N) where M = word length, N = wordList size
 * SPACE: O(M * N)
 */
public class WordLadder {

    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;

        Queue<String> queue = new LinkedList<>();
        queue.offer(beginWord);
        Set<String> visited = new HashSet<>();
        visited.add(beginWord);
        int level = 1;

        while (!queue.isEmpty()) {
            int size = queue.size();

            for (int i = 0; i < size; i++) {
                String word = queue.poll();

                for (int j = 0; j < word.length(); j++) {
                    char[] chars = word.toCharArray();

                    for (char c = 'a'; c <= 'z'; c++) {
                        chars[j] = c;
                        String neighbor = new String(chars);

                        if (neighbor.equals(endWord)) return level + 1;

                        if (wordSet.contains(neighbor) && !visited.contains(neighbor)) {
                            visited.add(neighbor);
                            queue.offer(neighbor);
                        }
                    }
                }
            }

            level++;
        }

        return 0;
    }
}
