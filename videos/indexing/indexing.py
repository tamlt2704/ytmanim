from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class DatabaseIndexing(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Database Indexing Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Without index - full scan
        no_idx = Text("Without Index", font_size=22, color=RED).shift(UP * 2.5)
        self.play(Write(no_idx))
        rows = VGroup()
        for i in range(8):
            box = Rectangle(width=0.8, height=0.5, color=GREY, fill_opacity=0.2)
            box.shift(LEFT * 3.5 + RIGHT * i * 0.9 + UP * 1.2)
            rows.add(box)
        self.play(FadeIn(rows), run_time=0.3)

        for box in rows:
            box.set_fill(RED, opacity=0.3)
            self.wait(0.15)
        scan_label = Text("Full table scan: O(n)", font_size=16, color=RED).shift(UP * 0.3)
        self.play(Write(scan_label), run_time=0.3)

        # With index - B-tree
        with_idx = Text("With Index (B-Tree)", font_size=22, color=GREEN).shift(DOWN * 0.5)
        self.play(Write(with_idx))

        root = Dot(DOWN * 1.5, color=GREEN, radius=0.15)
        l = Dot(DOWN * 1.5 + LEFT * 2 + DOWN * 0.8, color=GREEN, radius=0.15)
        r = Dot(DOWN * 1.5 + RIGHT * 2 + DOWN * 0.8, color=GREEN, radius=0.15)
        target = Dot(DOWN * 1.5 + RIGHT * 1 + DOWN * 1.6, color=YELLOW, radius=0.2)
        lines = VGroup(
            Line(root.get_center(), l.get_center(), color=GREEN),
            Line(root.get_center(), r.get_center(), color=GREEN),
            Line(r.get_center(), target.get_center(), color=YELLOW),
        )
        self.play(FadeIn(root, l, r, target, lines), run_time=0.5)

        idx_label = Text("Index lookup: O(log n)", font_size=16, color=GREEN).shift(DOWN * 3.2)
        self.play(Write(idx_label))
        self.wait(2)
