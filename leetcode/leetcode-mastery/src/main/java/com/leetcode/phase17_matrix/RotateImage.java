package com.leetcode.phase17_matrix;

/**
 * LeetCode #48 - Rotate Image (Medium)
 *
 * PROBLEM: Rotate an n×n matrix 90 degrees clockwise in-place.
 *
 * PATTERN: Transpose + Reverse Rows
 *
 * KEY INSIGHT: 90° clockwise rotation = transpose (swap rows/cols) then reverse each row.
 * This avoids complex index math and works in-place.
 *
 * TIME: O(n²), SPACE: O(1)
 */
public class RotateImage {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        // Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        // Reverse each row
        for (int[] row : matrix) {
            int l = 0, r = n - 1;
            while (l < r) {
                int temp = row[l]; row[l] = row[r]; row[r] = temp;
                l++; r--;
            }
        }
    }
}
