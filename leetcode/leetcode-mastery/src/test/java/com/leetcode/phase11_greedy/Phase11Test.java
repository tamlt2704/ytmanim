package com.leetcode.phase11_greedy;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class Phase11Test {

    private final JumpGame jg = new JumpGame();

    @Test void jump_possible() { assertThat(jg.canJump(new int[]{2,3,1,1,4})).isTrue(); }
    @Test void jump_impossible() { assertThat(jg.canJump(new int[]{3,2,1,0,4})).isFalse(); }
    @Test void jump_single() { assertThat(jg.canJump(new int[]{0})).isTrue(); }

    private final TaskScheduler ts = new TaskScheduler();

    @Test void scheduler_basic() {
        assertThat(ts.leastInterval(new char[]{'A','A','A','B','B','B'}, 2)).isEqualTo(8);
    }
    @Test void scheduler_noIdle() {
        assertThat(ts.leastInterval(new char[]{'A','A','A','B','B','B'}, 0)).isEqualTo(6);
    }
    @Test void scheduler_single() {
        assertThat(ts.leastInterval(new char[]{'A'}, 2)).isEqualTo(1);
    }
}
