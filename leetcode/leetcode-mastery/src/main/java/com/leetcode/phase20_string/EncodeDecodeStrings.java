package com.leetcode.phase20_string;

import java.util.ArrayList;
import java.util.List;

/**
 * LeetCode #271 - Encode and Decode Strings (Medium)
 *
 * PROBLEM: Design an algorithm to encode a list of strings to a single string,
 * and decode it back.
 *
 * PATTERN: Length-Prefixed Encoding
 *
 * KEY INSIGHT: Prefix each string with its length and a delimiter.
 * "hello" → "5#hello". This handles any character including '#' inside strings.
 *
 * TIME: O(total characters), SPACE: O(total characters)
 */
public class EncodeDecodeStrings {

    public String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs) {
            sb.append(s.length()).append('#').append(s);
        }
        return sb.toString();
    }

    public List<String> decode(String s) {
        List<String> result = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int hashIdx = s.indexOf('#', i);
            int len = Integer.parseInt(s.substring(i, hashIdx));
            String str = s.substring(hashIdx + 1, hashIdx + 1 + len);
            result.add(str);
            i = hashIdx + 1 + len;
        }
        return result;
    }
}
