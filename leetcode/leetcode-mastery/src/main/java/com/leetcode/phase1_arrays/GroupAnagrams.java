package com.leetcode.phase1_arrays;

import java.util.*;

/**
 * LeetCode #49 - Group Anagrams (Medium)
 *
 * PROBLEM: Given an array of strings, group anagrams together.
 * Example: ["eat","tea","tan","ate","nat","bat"] → [["eat","tea","ate"],["tan","nat"],["bat"]]
 *
 * PATTERN: Hash Map with Canonical Key
 *
 * APPROACH:
 * - Two strings are anagrams if they have the same characters in the same frequency
 * - Sort each string → anagrams produce the same sorted string → use as map key
 * - Alternative: use character frequency array as key (faster for short strings)
 *
 * KEY INSIGHT: Transform each string into a canonical form that's identical for all anagrams.
 * Sorting is the simplest canonical form. Frequency counting is faster for large inputs.
 *
 * TIME: O(n * k log k) where n = number of strings, k = max string length (sorting each string)
 * SPACE: O(n * k) — storing all strings in the map
 */
public class GroupAnagrams {

    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();

        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);

            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        return new ArrayList<>(groups.values());
    }

    /**
     * Alternative: O(n * k) using frequency counting instead of sorting.
     */
    public List<List<String>> groupAnagramsOptimal(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();

        for (String s : strs) {
            int[] freq = new int[26];
            for (char c : s.toCharArray()) {
                freq[c - 'a']++;
            }
            String key = Arrays.toString(freq); // e.g., "[1, 0, 0, ..., 1, 0]"
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        return new ArrayList<>(groups.values());
    }
}
