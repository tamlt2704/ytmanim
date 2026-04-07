package com.leetcode.phase9_graphs;

/**
 * LeetCode #200 - Number of Islands (Medium)
 *
 * PROBLEM: Given a 2D grid of '1' (land) and '0' (water), count the number of islands.
 * An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.
 *
 * PATTERN: DFS Flood Fill on Grid
 *
 * APPROACH:
 * - Iterate through every cell
 * - When you find a '1', increment island count and DFS to mark all connected land as visited
 * - Mark visited cells by changing '1' to '0' (in-place, no visited array needed)
 *
 * KEY INSIGHT: Each DFS call "sinks" an entire island. The number of DFS calls from the
 * main loop = number of islands.
 *
 * TIME: O(m * n) — each cell visited at most once
 * SPACE: O(m * n) — recursion stack in worst case (all land)
 */
public class NumberOfIslands {

    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }

    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == '0') {
            return;
        }
        grid[r][c] = '0'; // sink the land
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}
