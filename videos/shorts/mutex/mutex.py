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
            # Acquire
            a1 = Arrow(threads[i][0].get_right(), lock.get_left(), buff=0.1, color=colors[i], stroke_width=2)
            acq = Text("acquire", font_size=12, color=colors[i]).next_to(a1, UP, buff=0.05)
            self.play(GrowArrow(a1), FadeIn(acq), run_time=0.4)
            lock.set_fill(colors[i], opacity=0.3)
            a2 = Arrow(lock.get_right(), resource.get_left(), buff=0.1, color=colors[i], stroke_width=2)
            self.play(GrowArrow(a2), run_time=0.3)
            self.wait(0.3)
            # Release
            lock.set_fill(BLACK, opacity=0)
            self.play(FadeOut(a1, a2, acq), run_time=0.2)

        safe = Text("One at a time ✓", font_size=24, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(safe))
        self.wait(2)
