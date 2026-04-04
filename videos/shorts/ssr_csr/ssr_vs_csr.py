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

        ssr_steps = ["Request", "Server renders HTML", "Full page sent", "Interactive"]
        for i, step in enumerate(ssr_steps):
            txt = Text(step, font_size=14, color=BLUE).shift(LEFT * 3 + UP * (1.2 - i * 0.7))
            arrow = Triangle(color=BLUE).scale(0.1).next_to(txt, LEFT, buff=0.1)
            self.play(FadeIn(txt, arrow), run_time=0.3)

        csr_steps = ["Request", "Empty HTML + JS", "JS downloads", "JS renders page"]
        for i, step in enumerate(csr_steps):
            txt = Text(step, font_size=14, color=GREEN).shift(RIGHT * 3 + UP * (1.2 - i * 0.7))
            arrow = Triangle(color=GREEN).scale(0.1).next_to(txt, LEFT, buff=0.1)
            self.play(FadeIn(txt, arrow), run_time=0.3)

        ssr_note = Text("Fast first paint, SEO ✓", font_size=16, color=BLUE).shift(LEFT * 3 + DOWN * 2)
        csr_note = Text("Rich interactions, SPA ✓", font_size=16, color=GREEN).shift(RIGHT * 3 + DOWN * 2)
        self.play(Write(ssr_note), Write(csr_note))
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # Timeline comparison
        tl_title = Text("Loading Timeline", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(tl_title))

        # SSR timeline
        ssr_lbl = Text("SSR:", font_size=16, color=BLUE).shift(LEFT * 5.5 + UP * 1.5)
        ssr_bar1 = Rectangle(width=2, height=0.4, color=BLUE, fill_opacity=0.4).shift(LEFT * 3 + UP * 1.5)
        ssr_l1 = Text("Server render", font_size=10).move_to(ssr_bar1)
        ssr_bar2 = Rectangle(width=1, height=0.4, color=TEAL, fill_opacity=0.4).shift(LEFT * 0.5 + UP * 1.5)
        ssr_l2 = Text("Hydrate", font_size=10).move_to(ssr_bar2)
        fp_ssr = DashedLine(LEFT * 2 + UP * 2, LEFT * 2 + UP * 1, color=YELLOW, stroke_width=2)
        fp_lbl = Text("First Paint", font_size=10, color=YELLOW).next_to(fp_ssr, UP, buff=0.05)
        self.play(FadeIn(ssr_lbl, ssr_bar1, ssr_l1, ssr_bar2, ssr_l2, fp_ssr, fp_lbl), run_time=0.5)

        # CSR timeline
        csr_lbl = Text("CSR:", font_size=16, color=GREEN).shift(LEFT * 5.5 + DOWN * 0)
        csr_bar1 = Rectangle(width=1, height=0.4, color=GREEN, fill_opacity=0.4).shift(LEFT * 3.5 + DOWN * 0)
        csr_l1 = Text("HTML", font_size=10).move_to(csr_bar1)
        csr_bar2 = Rectangle(width=2, height=0.4, color=ORANGE, fill_opacity=0.4).shift(LEFT * 1.5 + DOWN * 0)
        csr_l2 = Text("Download JS", font_size=10).move_to(csr_bar2)
        csr_bar3 = Rectangle(width=1.5, height=0.4, color=TEAL, fill_opacity=0.4).shift(RIGHT * 0.75 + DOWN * 0)
        csr_l3 = Text("Render", font_size=10).move_to(csr_bar3)
        fp_csr = DashedLine(RIGHT * 1.5 + UP * 0.5, RIGHT * 1.5 + DOWN * 0.5, color=YELLOW, stroke_width=2)
        self.play(FadeIn(csr_lbl, csr_bar1, csr_l1, csr_bar2, csr_l2, csr_bar3, csr_l3, fp_csr), run_time=0.5)

        faster = Text("SSR: faster first paint!", font_size=16, color=BLUE).shift(DOWN * 1.5)
        self.play(Write(faster))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # When to use
        when_title = Text("When to Use", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(when_title))

        ssr_when = VGroup(
            Text("SSR when:", font_size=18, color=BLUE, weight=BOLD),
            Text("• SEO matters (blogs, e-commerce)", font_size=14),
            Text("• Fast initial load needed", font_size=14),
            Text("• Content-heavy pages", font_size=14),
            Text("Tools: Next.js, Nuxt.js", font_size=12, color=GREY),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        csr_when = VGroup(
            Text("CSR when:", font_size=18, color=GREEN, weight=BOLD),
            Text("• Rich interactivity (dashboards)", font_size=14),
            Text("• Behind auth (no SEO needed)", font_size=14),
            Text("• Real-time updates", font_size=14),
            Text("Tools: React SPA, Vue SPA", font_size=12, color=GREY),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(ssr_when), run_time=0.5)
        self.play(FadeIn(csr_when), run_time=0.5)
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
