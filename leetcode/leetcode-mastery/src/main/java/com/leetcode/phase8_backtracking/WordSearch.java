package com.leetcode.phase8_backtracking;

/**
 * LeetCode #79 - Word Search (Medium)
 *
 * PROBLEM: Given a 2D board and a word, find if the word exists in the grid.
 * Can move up/down/left/right, each cell used at most once.
 *
 * PATTERN: DFS Backtracking on Grid
 *
 * KEY INSIGHT: Mark cells as visited by modifying the board in-place (set to '#'),
 * then restore after backtracking. This avoids allocating a visited[][] array.
 *
 * TIME: O(m * n * 4^L) where L = word length (4 directions at each step)
 * SPACE: O(L) — recursion depth
 */
public class WordSearch {

    public boolean exist(char[][] board, String word) {
        int rows = board.length, cols = board[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }

        return false;
    }

    private boolean dfs(char[][] board, String word, int r, int c, int index) {
        if (index == word.length()) return true; // found all characters

        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length
                || board[r][c] != word.charAt(index)) {
            return false;
        }

        char temp = board[r][c];
        board[r][c] = '#'; // mark visited

        boolean found = dfs(board, word, r + 1, c, index + 1)
                || dfs(board, word, r - 1, c, index + 1)
                || dfs(board, word, r, c + 1, index + 1)
                || dfs(board, word, r, c - 1, index + 1);

        board[r][c] = temp; // restore (backtrack)
        return found;
    }
}
