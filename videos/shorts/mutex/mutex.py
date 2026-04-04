from manim import *

class MutexExplained(Scene):
    def construct(self):
        title = Text("Mutex Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        resource = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=YELLOW).shift(RIGHT * 2)
        res_label = Text("Shared\nResource", font_size=16).move_to(resource)
        lock = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.8, color=RED).shift(ORIGIN)
        lock_label = Text("Mutex", font_size=16, color=RED).move_to(lock)

        threads = VGroup()
        for i in range(3):
            t = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.7, color=BLUE)
            t.shift(LEFT * 4 + UP * (1 - i * 1))
            label = Text(f"T{i+1}", font_size=16).move_to(t)
            threads.add(VGroup(t, label))

        self.play(FadeIn(resource, res_label, lock, lock_label, threads))

        colors = [BLUE, GREEN, PURPLE]
        for i in range(3):
            a1 = Arrow(threads[i][0].get_right(), lock.get_left(), buff=0.1, color=colors[i], stroke_width=2)
            acq = Text("acquire", font_size=12, color=colors[i]).next_to(a1, UP, buff=0.05)
            self.play(GrowArrow(a1), FadeIn(acq), run_time=0.4)
            lock.set_fill(colors[i], opacity=0.3)
            a2 = Arrow(lock.get_right(), resource.get_left(), buff=0.1, color=colors[i], stroke_width=2)
            self.play(GrowArrow(a2), run_time=0.3)
            self.wait(0.3)
            lock.set_fill(BLACK, opacity=0)
            self.play(FadeOut(a1, a2, acq), run_time=0.2)

        safe = Text("One at a time ✓", font_size=24, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(safe))
        self.wait(1)
        self.play(FadeOut(resource, res_label, lock, lock_label, threads, safe))

        # Without mutex - race condition
        race_title = Text("Without Mutex: Race Condition!", font_size=28, color=RED).shift(UP * 2.5)
        self.play(Write(race_title))

        var = Text("balance = 100", font_size=20, color=YELLOW).shift(UP * 1.2)
        self.play(Write(var))

        t1_read = Text("T1: read 100", font_size=16, color=BLUE).shift(LEFT * 3 + UP * 0.2)
        t2_read = Text("T2: read 100", font_size=16, color=GREEN).shift(RIGHT * 3 + UP * 0.2)
        self.play(FadeIn(t1_read, t2_read), run_time=0.5)

        t1_write = Text("T1: write 110", font_size=16, color=BLUE).shift(LEFT * 3 + DOWN * 0.5)
        t2_write = Text("T2: write 110", font_size=16, color=GREEN).shift(RIGHT * 3 + DOWN * 0.5)
        self.play(FadeIn(t1_write, t2_write), run_time=0.5)

        wrong = Text("Expected 120, got 110! 💀", font_size=20, color=RED).shift(DOWN * 1.5)
        self.play(Write(wrong))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Mutex vs Semaphore
        vs_title = Text("Mutex vs Semaphore", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(vs_title))

        mutex_info = VGroup(
            Text("Mutex", font_size=20, color=RED, weight=BOLD),
            Text("• Binary (locked/unlocked)", font_size=14),
            Text("• Only owner can unlock", font_size=14),
            Text("• Mutual exclusion", font_size=14),
            Text("• 1 thread at a time", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        sem_info = VGroup(
            Text("Semaphore", font_size=20, color=GREEN, weight=BOLD),
            Text("• Counter (0 to N)", font_size=14),
            Text("• Any thread can signal", font_size=14),
            Text("• Resource counting", font_size=14),
            Text("• N threads at a time", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(mutex_info), run_time=0.5)
        self.play(FadeIn(sem_info), run_time=0.5)
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
