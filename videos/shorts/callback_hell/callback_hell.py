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

        self.play(FadeOut(code_group, hell_label), run_time=0.5)

        # Solution
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

        fix = Text("✅ async/await to the rescue!", font_size=24, color=GREEN).shift(DOWN * 2)
        self.play(Write(fix))
        self.wait(2)
