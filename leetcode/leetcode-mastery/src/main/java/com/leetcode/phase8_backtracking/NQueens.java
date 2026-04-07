package com.leetcode.phase8_backtracking;

import java.util.*;

/**
 * LeetCode #51 - N-Queens (Hard)
 *
 * PROBLEM: Place n queens on an n×n chessboard so no two queens attack each other.
 *
 * PATTERN: Backtracking with Constraint Propagation
 *
 * APPROACH:
 * - Place queens row by row (one per row guaranteed)
 * - For each row, try each column
 * - Check constraints: no same column, no same diagonal, no same anti-diagonal
 * - Use sets for O(1) constraint checking
 *
 * KEY INSIGHT: Diagonals have a property: all cells on the same diagonal have the same
 * (row - col) value. All cells on the same anti-diagonal have the same (row + col) value.
 * Store these in sets for instant conflict detection.
 *
 * TIME: O(n!) — at most n choices for row 0, n-1 for row 1, etc.
 * SPACE: O(n²) — storing board configurations
 */
public class NQueens {

    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        Set<Integer> cols = new HashSet<>();
        Set<Integer> diags = new HashSet<>();     // row - col
        Set<Integer> antiDiags = new HashSet<>();  // row + col
        char[][] board = new char[n][n];

        for (char[] row : board) Arrays.fill(row, '.');

        backtrack(board, 0, n, cols, diags, antiDiags, result);
        return result;
    }

    private void backtrack(char[][] board, int row, int n,
                           Set<Integer> cols, Set<Integer> diags, Set<Integer> antiDiags,
                           List<List<String>> result) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (char[] r : board) solution.add(new String(r));
            result.add(solution);
            return;
        }

        for (int col = 0; col < n; col++) {
            int diag = row - col;
            int antiDiag = row + col;

            if (cols.contains(col) || diags.contains(diag) || antiDiags.contains(antiDiag)) {
                continue; // conflict
            }

            // Choose
            board[row][col] = 'Q';
            cols.add(col);
            diags.add(diag);
            antiDiags.add(antiDiag);

            // Explore
            backtrack(board, row + 1, n, cols, diags, antiDiags, result);

            // Unchoose
            board[row][col] = '.';
            cols.remove(col);
            diags.remove(diag);
            antiDiags.remove(antiDiag);
        }
    }
}
