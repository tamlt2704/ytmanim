from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class AsyncAwait(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Async/Await Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Sync
        sync_title = Text("Synchronous", font_size=24, color=RED).shift(LEFT * 3 + UP * 2.5)
        self.play(Write(sync_title))
        sync_tasks = VGroup()
        for i in range(3):
            box = Rectangle(width=2, height=0.5, color=RED, fill_opacity=0.3)
            box.shift(LEFT * 3 + UP * (1.2 - i * 0.7))
            txt = Text(f"Task {i+1}", font_size=14).move_to(box)
            sync_tasks.add(VGroup(box, txt))
        for t in sync_tasks:
            self.play(FadeIn(t), run_time=0.4)
        block = Text("⏳ Blocking!", font_size=16, color=RED).shift(LEFT * 3 + DOWN * 1)
        self.play(Write(block), run_time=0.3)

        # Async
        async_title = Text("Async/Await", font_size=24, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(async_title))
        async_tasks = VGroup()
        for i in range(3):
            box = Rectangle(width=2, height=0.5, color=GREEN, fill_opacity=0.3)
            box.shift(RIGHT * (2 + i * 0.3) + UP * (1.2 - i * 0.3))
            txt = Text(f"Task {i+1}", font_size=14).move_to(box)
            async_tasks.add(VGroup(box, txt))
        self.play(*[FadeIn(t) for t in async_tasks], run_time=0.5)
        nonblock = Text("⚡ Non-blocking!", font_size=16, color=GREEN).shift(RIGHT * 3 + DOWN * 1)
        self.play(Write(nonblock), run_time=0.3)

        self.wait(2)
