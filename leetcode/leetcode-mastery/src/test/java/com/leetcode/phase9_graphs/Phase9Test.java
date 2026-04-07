package com.leetcode.phase9_graphs;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.*;

class Phase9Test {

    private final NumberOfIslands noi = new NumberOfIslands();

    @Test void islands_basic() {
        char[][] grid = {
                {'1','1','1','1','0'},
                {'1','1','0','1','0'},
                {'1','1','0','0','0'},
                {'0','0','0','0','0'}
        };
        assertThat(noi.numIslands(grid)).isEqualTo(1);
    }
    @Test void islands_multiple() {
        char[][] grid = {
                {'1','1','0','0','0'},
                {'1','1','0','0','0'},
                {'0','0','1','0','0'},
                {'0','0','0','1','1'}
        };
        assertThat(noi.numIslands(grid)).isEqualTo(3);
    }

    private final CourseSchedule cs = new CourseSchedule();

    @Test void courses_possible() { assertThat(cs.canFinish(2, new int[][]{{1,0}})).isTrue(); }
    @Test void courses_cycle() { assertThat(cs.canFinish(2, new int[][]{{1,0},{0,1}})).isFalse(); }
    @Test void courses_none() { assertThat(cs.canFinish(1, new int[][]{})).isTrue(); }

    private final WordLadder wl = new WordLadder();

    @Test void ladder_basic() {
        assertThat(wl.ladderLength("hit", "cog", List.of("hot","dot","dog","lot","log","cog"))).isEqualTo(5);
    }
    @Test void ladder_impossible() {
        assertThat(wl.ladderLength("hit", "cog", List.of("hot","dot","dog","lot","log"))).isEqualTo(0);
    }
}
