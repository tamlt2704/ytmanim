package com.leetcode.phase17_matrix;

import java.util.ArrayList;
import java.util.List;

/**
 * LeetCode #54 - Spiral Matrix (Medium)
 *
 * PATTERN: Layer-by-layer traversal with shrinking boundaries
 *
 * KEY INSIGHT: Maintain top/bottom/left/right boundaries. Traverse right→down→left→up,
 * shrinking the boundary after each direction. Stop when boundaries cross.
 *
 * TIME: O(m*n), SPACE: O(1) extra
 */
public class SpiralMatrix {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) result.add(matrix[top][c]);
            top++;
            for (int r = top; r <= bottom; r++) result.add(matrix[r][right]);
            right--;
            if (top <= bottom) {
                for (int c = right; c >= left; c--) result.add(matrix[bottom][c]);
                bottom--;
            }
            if (left <= right) {
                for (int r = bottom; r >= top; r--) result.add(matrix[r][left]);
                left++;
            }
        }
        return result;
    }
}
