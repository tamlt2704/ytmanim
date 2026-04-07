package com.leetcode.phase6_trees;

import java.util.*;

/**
 * LeetCode #297 - Serialize and Deserialize Binary Tree (Hard)
 *
 * PATTERN: Preorder DFS with null markers
 *
 * APPROACH:
 * - Serialize: preorder traversal, write "null" for null nodes
 * - Deserialize: read values in order, recursively build left then right
 *
 * KEY INSIGHT: Preorder + null markers uniquely defines a binary tree.
 * The null markers tell us exactly where subtrees end, so we don't need
 * inorder traversal as a second input.
 *
 * TIME: O(n), SPACE: O(n)
 */
public class SerializeDeserializeBT {

    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        serializeDFS(root, sb);
        return sb.toString();
    }

    private void serializeDFS(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("null,");
            return;
        }
        sb.append(node.val).append(",");
        serializeDFS(node.left, sb);
        serializeDFS(node.right, sb);
    }

    public TreeNode deserialize(String data) {
        Queue<String> tokens = new LinkedList<>(Arrays.asList(data.split(",")));
        return deserializeDFS(tokens);
    }

    private TreeNode deserializeDFS(Queue<String> tokens) {
        String val = tokens.poll();
        if (val == null || val.equals("null")) return null;

        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = deserializeDFS(tokens);
        node.right = deserializeDFS(tokens);
        return node;
    }
}
