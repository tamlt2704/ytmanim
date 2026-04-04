from manim import *

class AsyncAwait(Scene):
    def construct(self):
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

        self.wait(1.5)
        self.play(FadeOut(sync_title, sync_tasks, block, async_title, async_tasks, nonblock))

        # Timeline comparison
        tl_title = Text("Execution Timeline", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(tl_title))

        # Sync timeline
        sync_lbl = Text("Sync:", font_size=16, color=RED).shift(LEFT * 5.5 + UP * 1.5)
        self.play(FadeIn(sync_lbl))
        sync_bars = VGroup()
        colors = [BLUE, GREEN, ORANGE]
        for i in range(3):
            bar = Rectangle(width=2, height=0.4, color=colors[i], fill_opacity=0.4)
            bar.shift(LEFT * 3 + RIGHT * i * 2 + UP * 1.5)
            lbl = Text(f"T{i+1}", font_size=12).move_to(bar)
            sync_bars.add(VGroup(bar, lbl))
            self.play(FadeIn(sync_bars[-1]), run_time=0.3)

        total_sync = Text("Total: 6s", font_size=14, color=RED).next_to(sync_bars, RIGHT, buff=0.3)
        self.play(FadeIn(total_sync))

        # Async timeline
        async_lbl = Text("Async:", font_size=16, color=GREEN).shift(LEFT * 5.5 + DOWN * 0)
        self.play(FadeIn(async_lbl))
        async_bars = VGroup()
        offsets = [0, 0.3, 0.6]
        for i in range(3):
            bar = Rectangle(width=2, height=0.4, color=colors[i], fill_opacity=0.4)
            bar.shift(LEFT * 3 + RIGHT * offsets[i] * 2 + DOWN * (0 + i * 0.5))
            lbl = Text(f"T{i+1}", font_size=12).move_to(bar)
            async_bars.add(VGroup(bar, lbl))
        self.play(*[FadeIn(b) for b in async_bars], run_time=0.5)

        total_async = Text("Total: ~2s", font_size=14, color=GREEN).next_to(async_bars[0], RIGHT, buff=2)
        self.play(FadeIn(total_async))
        self.wait(1.5)
        self.play(FadeOut(tl_title, sync_lbl, sync_bars, total_sync, async_lbl, async_bars, total_async))

        # Code example
        code_title = Text("Syntax", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(code_title))

        code_lines = [
            ("async function fetchData() {", TEAL),
            ("  const users = await getUsers()", WHITE),
            ("  const posts = await getPosts()", WHITE),
            ("  return { users, posts }", GREEN),
            ("}", TEAL),
        ]
        code_group = VGroup()
        for i, (line, color) in enumerate(code_lines):
            txt = Text(line, font_size=16, color=color, font="Monospace").shift(UP * (1 - i * 0.6) + LEFT * 1)
            code_group.add(txt)
            self.play(FadeIn(txt), run_time=0.3)

        note = Text("await pauses until promise resolves", font_size=16, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(note))
        self.wait(2)
        self.play(FadeOut(code_title, code_group, note))
