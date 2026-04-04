from manim import *

class CallbackHell(Scene):
    def construct(self):
        title = Text("Callback Hell Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        lines = [
            "getData(function(a) {",
            "  getMore(a, function(b) {",
            "    getMore(b, function(c) {",
            "      getMore(c, function(d) {",
            "        // pyramid of doom",
            "      })",
            "    })",
            "  })",
            "})",
        ]

        code_group = VGroup()
        for i, line in enumerate(lines):
            txt = Text(line, font_size=16, color=RED if i < 4 else GREY).shift(UP * (2 - i * 0.45) + LEFT * 1)
            code_group.add(txt)
            self.play(FadeIn(txt), run_time=0.3)

        hell_label = Text("😱 Callback Hell!", font_size=28, color=RED).shift(DOWN * 2.5 + LEFT * 1)
        self.play(Write(hell_label))
        self.wait(1)

        # Highlight the pyramid shape
        pyramid = Polygon(
            LEFT * 1 + UP * 2, RIGHT * 2 + DOWN * 0.2, LEFT * 1 + DOWN * 2,
            color=YELLOW, stroke_width=2
        ).shift(LEFT * 0.5)
        self.play(Create(pyramid), run_time=0.5)
        self.wait(0.5)

        self.play(FadeOut(code_group, hell_label, pyramid), run_time=0.5)

        # Problems with callbacks
        prob_title = Text("Problems", font_size=28, color=RED).shift(UP * 2.5)
        self.play(Write(prob_title))
        problems = [
            "Hard to read & maintain",
            "Error handling is messy",
            "No easy way to run in parallel",
            "Inversion of control",
        ]
        prob_group = VGroup()
        for i, p in enumerate(problems):
            txt = Text(f"❌ {p}", font_size=18, color=RED).shift(UP * (1 - i * 0.7))
            prob_group.add(txt)
            self.play(FadeIn(txt), run_time=0.35)
        self.wait(1)
        self.play(FadeOut(prob_title, prob_group))

        # Solution: Promises
        prom_title = Text("Solution 1: Promises", font_size=28, color=BLUE).shift(UP * 2.5)
        self.play(Write(prom_title))
        promise_lines = [
            "getData()",
            "  .then(a => getMore(a))",
            "  .then(b => getMore(b))",
            "  .then(c => getMore(c))",
            "  .catch(err => handle(err))",
        ]
        prom_group = VGroup()
        for i, line in enumerate(promise_lines):
            txt = Text(line, font_size=18, color=BLUE).shift(UP * (1 - i * 0.6))
            prom_group.add(txt)
            self.play(FadeIn(txt), run_time=0.3)
        self.wait(1)
        self.play(FadeOut(prom_title, prom_group))

        # Solution: async/await
        sol_title = Text("Solution 2: async/await", font_size=28, color=GREEN).shift(UP * 2.5)
        self.play(Write(sol_title))
        solution_lines = [
            "const a = await getData()",
            "const b = await getMore(a)",
            "const c = await getMore(b)",
            "const d = await getMore(c)",
        ]
        sol_group = VGroup()
        for i, line in enumerate(solution_lines):
            txt = Text(line, font_size=18, color=GREEN).shift(UP * (1 - i * 0.6))
            sol_group.add(txt)
            self.play(FadeIn(txt), run_time=0.3)

        fix = Text("✅ Clean, readable, easy error handling!", font_size=22, color=GREEN).shift(DOWN * 2)
        self.play(Write(fix))
        self.wait(2)
        self.play(FadeOut(sol_title, sol_group, fix))
