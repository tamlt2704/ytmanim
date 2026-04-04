from manim import *

class Replication(Scene):
    def construct(self):
        title = Text("Database Replication Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        primary = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=BLUE).shift(LEFT * 3 + UP * 1)
        primary_label = Text("Primary\n(Write)", font_size=14, color=BLUE).move_to(primary)
        self.play(FadeIn(primary, primary_label))

        replicas = VGroup()
        for i in range(3):
            r = RoundedRectangle(corner_radius=0.15, width=2, height=0.9, color=GREEN, fill_opacity=0.2)
            r.shift(RIGHT * 3 + UP * (1.5 - i * 1.2))
            label = Text(f"Replica {i+1}\n(Read)", font_size=12, color=GREEN).move_to(r)
            replicas.add(VGroup(r, label))
            arrow = Arrow(primary.get_right(), r.get_left(), buff=0.1, color=YELLOW, stroke_width=2)
            sync = Text("sync", font_size=10, color=YELLOW).next_to(arrow, UP, buff=0.02)
            self.play(FadeIn(r, label), GrowArrow(arrow), FadeIn(sync), run_time=0.4)

        write = Text("Writes → Primary", font_size=18, color=BLUE).shift(DOWN * 2)
        read = Text("Reads → Replicas (distributed)", font_size=18, color=GREEN).shift(DOWN * 2.6)
        self.play(Write(write), run_time=0.4)
        self.play(Write(read), run_time=0.4)
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # Sync vs Async replication
        sync_title = Text("Synchronous vs Asynchronous", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(sync_title))

        sync_info = VGroup(
            Text("Synchronous", font_size=18, color=BLUE, weight=BOLD),
            Text("• Wait for replica confirmation", font_size=14),
            Text("• Strong consistency", font_size=14),
            Text("• Slower writes", font_size=14),
            Text("• No data loss", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        async_info = VGroup(
            Text("Asynchronous", font_size=18, color=GREEN, weight=BOLD),
            Text("• Don't wait for replica", font_size=14),
            Text("• Eventual consistency", font_size=14),
            Text("• Faster writes", font_size=14),
            Text("• Possible data loss", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(sync_info), run_time=0.5)
        self.play(FadeIn(async_info), run_time=0.5)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Failover
        fail_title = Text("Automatic Failover", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(fail_title))

        p = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=RED, fill_opacity=0.3).shift(LEFT * 3 + UP * 1)
        p_lbl = Text("Primary ✗", font_size=14, color=RED).move_to(p)
        r1 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN, fill_opacity=0.3).shift(RIGHT * 0 + UP * 1)
        r1_lbl = Text("Replica 1", font_size=14, color=GREEN).move_to(r1)
        r2 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN, fill_opacity=0.3).shift(RIGHT * 3 + UP * 1)
        r2_lbl = Text("Replica 2", font_size=14, color=GREEN).move_to(r2)

        self.play(FadeIn(p, p_lbl, r1, r1_lbl, r2, r2_lbl))
        crash = Text("💥 Primary fails!", font_size=18, color=RED).shift(DOWN * 0.5)
        self.play(Write(crash))
        self.wait(0.5)

        promote = Arrow(r1.get_top() + UP * 0.3, r1.get_top() + UP * 0.8, color=YELLOW, stroke_width=3)
        new_primary = Text("New Primary ✓", font_size=14, color=YELLOW).next_to(promote, UP, buff=0.05)
        self.play(GrowArrow(promote), FadeIn(new_primary), run_time=0.5)

        zero = Text("Zero downtime with automatic failover!", font_size=18, color=GREEN).shift(DOWN * 2)
        self.play(Write(zero))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
