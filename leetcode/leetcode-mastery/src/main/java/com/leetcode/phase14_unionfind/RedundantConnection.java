package com.leetcode.phase14_unionfind;

/**
 * LeetCode #684 - Redundant Connection (Medium)
 *
 * PROBLEM: A tree with one extra edge. Find the edge that, if removed, makes it a tree.
 *
 * PATTERN: Union-Find — the first edge that connects two already-connected nodes is redundant.
 *
 * KEY INSIGHT: Process edges in order. If union(a, b) returns false (already same component),
 * that edge is the redundant one.
 *
 * TIME: O(n * α(n)), SPACE: O(n)
 */
public class RedundantConnection {

    private int[] parent;
    private int[] rank;

    public int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        parent = new int[n + 1];
        rank = new int[n + 1];
        for (int i = 1; i <= n; i++) parent[i] = i;

        for (int[] edge : edges) {
            if (!union(edge[0], edge[1])) {
                return edge; // this edge creates a cycle
            }
        }
        return new int[]{};
    }

    private int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    private boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) parent[ra] = rb;
        else if (rank[ra] > rank[rb]) parent[rb] = ra;
        else { parent[rb] = ra; rank[ra]++; }
        return true;
    }
}
