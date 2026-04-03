from manim import *

class SSRvsCSR(Scene):
    def construct(self):
        title = Text("SSR vs CSR", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        ssr_title = Text("Server-Side Rendering", font_size=22, color=BLUE).shift(LEFT * 3 + UP * 2.5)
        csr_title = Text("Client-Side Rendering", font_size=22, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(ssr_title), Write(csr_title))

        # SSR flow
        ssr_steps = ["Request", "Server renders HTML", "Full page sent", "Interactive"]
        for i, step in enumerate(ssr_steps):
            txt = Text(step, font_size=14, color=BLUE).shift(LEFT * 3 + UP * (1.2 - i * 0.7))
            arrow = Triangle(color=BLUE).scale(0.1).next_to(txt, LEFT, buff=0.1)
            self.play(FadeIn(txt, arrow), run_time=0.3)

        # CSR flow
        csr_steps = ["Request", "Empty HTML + JS", "JS downloads", "JS renders page"]
        for i, step in enumerate(csr_steps):
            txt = Text(step, font_size=14, color=GREEN).shift(RIGHT * 3 + UP * (1.2 - i * 0.7))
            arrow = Triangle(color=GREEN).scale(0.1).next_to(txt, LEFT, buff=0.1)
            self.play(FadeIn(txt, arrow), run_time=0.3)

        ssr_note = Text("Fast first paint, SEO ✓", font_size=16, color=BLUE).shift(LEFT * 3 + DOWN * 2)
        csr_note = Text("Rich interactions, SPA ✓", font_size=16, color=GREEN).shift(RIGHT * 3 + DOWN * 2)
        self.play(Write(ssr_note), Write(csr_note))
        self.wait(2)
