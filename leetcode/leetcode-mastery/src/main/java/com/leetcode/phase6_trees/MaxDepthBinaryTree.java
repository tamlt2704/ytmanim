package com.leetcode.phase6_trees;

/**
 * LeetCode #104 - Maximum Depth of Binary Tree (Easy)
 *
 * PATTERN: DFS Recursion — the simplest tree problem. Base case + recurse left/right + combine.
 *
 * KEY INSIGHT: The depth of a tree = 1 + max(depth of left subtree, depth of right subtree).
 * This is the template for most tree problems.
 *
 * TIME: O(n), SPACE: O(h) where h = height (recursion stack)
 */
public class MaxDepthBinaryTree {

    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
