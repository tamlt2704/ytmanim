package com.leetcode.phase6_trees;

import java.util.*;

/**
 * LeetCode #102 - Binary Tree Level Order Traversal (Medium)
 *
 * PATTERN: BFS with Queue — process nodes level by level.
 *
 * KEY INSIGHT: Use queue.size() at the start of each level to know how many nodes
 * belong to the current level. This separates levels without extra markers.
 *
 * TIME: O(n), SPACE: O(n) — queue holds up to n/2 nodes (last level)
 */
public class LevelOrderTraversal {

    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> level = new ArrayList<>();

            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }

            result.add(level);
        }

        return result;
    }
}
