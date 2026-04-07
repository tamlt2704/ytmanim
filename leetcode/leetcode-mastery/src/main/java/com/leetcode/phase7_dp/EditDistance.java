package com.leetcode.phase7_dp;

/**
 * LeetCode #72 - Edit Distance (Hard)
 *
 * PROBLEM: Given two strings, find the minimum number of operations (insert, delete, replace)
 * to convert word1 into word2.
 *
 * PATTERN: 2D DP — dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1]
 *
 * APPROACH:
 * - If characters match: dp[i][j] = dp[i-1][j-1] (no operation needed)
 * - If they don't match: dp[i][j] = 1 + min(
 *     dp[i-1][j],     // delete from word1
 *     dp[i][j-1],     // insert into word1
 *     dp[i-1][j-1]    // replace
 *   )
 * - Base cases: dp[i][0] = i (delete all), dp[0][j] = j (insert all)
 *
 * KEY INSIGHT: Each cell depends on three neighbors (left, top, diagonal).
 * The 2D table builds up from empty strings to full strings.
 *
 * TIME: O(m*n), SPACE: O(m*n) — can be optimized to O(min(m,n)) with rolling array
 */
public class EditDistance {

    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];

        // Base cases
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1]; // characters match
                } else {
                    dp[i][j] = 1 + Math.min(
                            dp[i - 1][j - 1], // replace
                            Math.min(dp[i - 1][j], dp[i][j - 1]) // delete or insert
                    );
                }
            }
        }

        return dp[m][n];
    }
}
