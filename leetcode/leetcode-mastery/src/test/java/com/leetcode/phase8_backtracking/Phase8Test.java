package com.leetcode.phase8_backtracking;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.*;

class Phase8Test {

    // --- Subsets ---
    private final Subsets subsets = new Subsets();

    @Test void subsets_basic() {
        var result = subsets.subsets(new int[]{1, 2, 3});
        assertThat(result).hasSize(8); // 2^3
        assertThat(result).contains(List.of(), List.of(1), List.of(1, 2, 3));
    }
    @Test void subsets_single() {
        assertThat(subsets.subsets(new int[]{0})).hasSize(2).contains(List.of(), List.of(0));
    }

    // --- Word Search ---
    private final WordSearch ws = new WordSearch();

    @Test void wordSearch_found() {
        char[][] board = {{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};
        assertThat(ws.exist(board, "ABCCED")).isTrue();
    }
    @Test void wordSearch_notFound() {
        char[][] board = {{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};
        assertThat(ws.exist(board, "ABCB")).isFalse();
    }

    // --- N-Queens ---
    private final NQueens nq = new NQueens();

    @Test void nqueens_4() {
        var result = nq.solveNQueens(4);
        assertThat(result).hasSize(2); // 4-queens has exactly 2 solutions
    }
    @Test void nqueens_1() {
        var result = nq.solveNQueens(1);
        assertThat(result).hasSize(1).first().asList().containsExactly("Q");
    }
}
