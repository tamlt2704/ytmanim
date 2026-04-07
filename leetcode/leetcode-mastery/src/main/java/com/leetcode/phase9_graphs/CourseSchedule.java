package com.leetcode.phase9_graphs;

import java.util.*;

/**
 * LeetCode #207 - Course Schedule (Medium)
 *
 * PROBLEM: There are numCourses courses with prerequisites. Determine if you can finish all courses.
 * Example: [[1,0]] means to take course 1 you must first take course 0.
 *
 * PATTERN: Topological Sort / Cycle Detection (BFS Kahn's Algorithm)
 *
 * APPROACH:
 * - Build adjacency list and in-degree array
 * - Start BFS from all nodes with in-degree 0 (no prerequisites)
 * - For each processed node, decrement in-degree of its neighbors
 * - If a neighbor's in-degree becomes 0, add to queue
 * - If all nodes are processed, no cycle exists → can finish all courses
 *
 * KEY INSIGHT: If there's a cycle, some nodes will never reach in-degree 0,
 * so the count of processed nodes will be less than numCourses.
 *
 * TIME: O(V + E) where V = courses, E = prerequisites
 * SPACE: O(V + E)
 */
public class CourseSchedule {

    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[numCourses];

        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());

        for (int[] pre : prerequisites) {
            graph.get(pre[1]).add(pre[0]); // pre[1] → pre[0]
            inDegree[pre[0]]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.offer(i);
        }

        int processed = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();
            processed++;

            for (int next : graph.get(course)) {
                inDegree[next]--;
                if (inDegree[next] == 0) queue.offer(next);
            }
        }

        return processed == numCourses;
    }
}
