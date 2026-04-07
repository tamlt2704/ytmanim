package com.leetcode.phase14_unionfind;

/**
 * LeetCode #323 - Number of Connected Components in an Undirected Graph (Medium)
 *
 * PATTERN: Union-Find (Disjoint Set Union)
 *
 * APPROACH:
 * - Initialize each node as its own parent
 * - For each edge, union the two nodes
 * - Count distinct roots = number of components
 *
 * KEY INSIGHT: Union-Find with path compression + union by rank gives near O(1) per operation.
 * Path compression flattens the tree on find(). Union by rank keeps trees balanced.
 *
 * TIME: O(n * α(n)) ≈ O(n) where α is the inverse Ackermann function
 * SPACE: O(n)
 */
public class NumberOfConnectedComponents {

    private int[] parent;
    private int[] rank;

    public int countComponents(int n, int[][] edges) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        int components = n;
        for (int[] edge : edges) {
            if (union(edge[0], edge[1])) {
                components--;
            }
        }
        return components;
    }

    private int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // path compression
        }
        return parent[x];
    }

    private boolean union(int a, int b) {
        int rootA = find(a), rootB = find(b);
        if (rootA == rootB) return false; // already connected

        // union by rank
        if (rank[rootA] < rank[rootB]) { parent[rootA] = rootB; }
        else if (rank[rootA] > rank[rootB]) { parent[rootB] = rootA; }
        else { parent[rootB] = rootA; rank[rootA]++; }
        return true;
    }
}
