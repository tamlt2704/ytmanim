package com.leetcode.phase6_trees;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.*;

class Phase6Test {

    // --- Max Depth ---
    private final MaxDepthBinaryTree md = new MaxDepthBinaryTree();

    @Test void maxDepth_basic() { assertThat(md.maxDepth(TreeNode.of(3, 9, 20, null, null, 15, 7))).isEqualTo(3); }
    @Test void maxDepth_single() { assertThat(md.maxDepth(TreeNode.of(1))).isEqualTo(1); }
    @Test void maxDepth_null() { assertThat(md.maxDepth(null)).isEqualTo(0); }

    // --- Level Order ---
    private final LevelOrderTraversal lo = new LevelOrderTraversal();

    @Test void levelOrder_basic() {
        var result = lo.levelOrder(TreeNode.of(3, 9, 20, null, null, 15, 7));
        assertThat(result).containsExactly(List.of(3), List.of(9, 20), List.of(15, 7));
    }
    @Test void levelOrder_null() { assertThat(lo.levelOrder(null)).isEmpty(); }

    // --- Serialize/Deserialize ---
    private final SerializeDeserializeBT sd = new SerializeDeserializeBT();

    @Test void serialize_roundTrip() {
        TreeNode root = TreeNode.of(1, 2, 3, null, null, 4, 5);
        String serialized = sd.serialize(root);
        TreeNode deserialized = sd.deserialize(serialized);

        assertThat(deserialized.val).isEqualTo(1);
        assertThat(deserialized.left.val).isEqualTo(2);
        assertThat(deserialized.right.val).isEqualTo(3);
        assertThat(deserialized.right.left.val).isEqualTo(4);
    }
    @Test void serialize_null() {
        assertThat(sd.deserialize(sd.serialize(null))).isNull();
    }
}
