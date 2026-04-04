from manim import *

class VirtualDOM(Scene):
    def construct(self):
        title = Text("Virtual DOM Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Problem: direct DOM manipulation
        problem = Text("Direct DOM updates are SLOW 🐌", font_size=28, color=RED)
        self.play(Write(problem))
        self.wait(1)
        solution = Text("Virtual DOM: update a copy, then patch", font_size=22, color=GREEN).shift(DOWN * 1)
        self.play(Write(solution))
        self.wait(1)
        self.play(FadeOut(problem, solution))

        real_label = Text("Real DOM", font_size=22, color=RED).shift(LEFT * 3 + UP * 2.5)
        vdom_label = Text("Virtual DOM", font_size=22, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(real_label), Write(vdom_label))

        def make_tree(offset, color):
            root = Dot(offset + UP * 1.5, color=color, radius=0.15)
            c1 = Dot(offset + LEFT * 1 + UP * 0.5, color=color, radius=0.15)
            c2 = Dot(offset + RIGHT * 1 + UP * 0.5, color=color, radius=0.15)
            c3 = Dot(offset + LEFT * 1.5 + DOWN * 0.5, color=color, radius=0.15)
            c4 = Dot(offset + LEFT * 0.5 + DOWN * 0.5, color=color, radius=0.15)
            lines = VGroup(
                Line(root.get_center(), c1.get_center(), color=color),
                Line(root.get_center(), c2.get_center(), color=color),
                Line(c1.get_center(), c3.get_center(), color=color),
                Line(c1.get_center(), c4.get_center(), color=color),
            )
            return VGroup(root, c1, c2, c3, c4, lines)

        real = make_tree(LEFT * 3, RED)
        vdom = make_tree(RIGHT * 3, GREEN)
        self.play(FadeIn(real), FadeIn(vdom), run_time=0.6)

        diff_dot = Dot(RIGHT * 2 + UP * 0.5, color=YELLOW, radius=0.2)
        diff_label = Text("Changed!", font_size=14, color=YELLOW).next_to(diff_dot, DOWN, buff=0.1)
        self.play(FadeIn(diff_dot, diff_label), run_time=0.4)

        arrow = Arrow(RIGHT * 1.5 + DOWN * 0.5, LEFT * 2 + DOWN * 0.5, color=YELLOW, stroke_width=3)
        patch = Text("Patch only diff", font_size=16, color=YELLOW).next_to(arrow, DOWN, buff=0.1)
        self.play(GrowArrow(arrow), Write(patch), run_time=0.5)

        fast = Text("Minimal DOM updates = Fast!", font_size=22, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(fast))
        self.wait(1)
        self.play(FadeOut(real_label, vdom_label, real, vdom, diff_dot, diff_label, arrow, patch, fast))

        # How it works step by step
        steps_title = Text("How Virtual DOM Works", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(steps_title))

        steps = [
            ("1. State changes", "User clicks button, data updates", BLUE),
            ("2. New Virtual DOM", "React creates new VDOM tree", GREEN),
            ("3. Diffing", "Compare old VDOM vs new VDOM", ORANGE),
            ("4. Reconciliation", "Calculate minimal changes needed", YELLOW),
            ("5. Patch Real DOM", "Apply only the differences", TEAL),
        ]
        for i, (step, desc, color) in enumerate(steps):
            s = Text(step, font_size=16, color=color, weight=BOLD).shift(LEFT * 2.5 + UP * (1 - i * 0.6))
            d = Text(desc, font_size=13).shift(RIGHT * 2 + UP * (1 - i * 0.6))
            self.play(FadeIn(s, d), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Frameworks using VDOM
        fw_title = Text("Who Uses Virtual DOM?", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(fw_title))

        frameworks = [
            ("React", "Virtual DOM (fiber)", BLUE),
            ("Vue", "Virtual DOM", GREEN),
            ("Svelte", "No VDOM (compiles away)", ORANGE),
            ("Solid", "No VDOM (fine-grained)", YELLOW),
        ]
        for i, (fw, approach, color) in enumerate(frameworks):
            f = Text(fw, font_size=20, color=color, weight=BOLD).shift(LEFT * 2.5 + UP * (1 - i * 0.8))
            a = Text(approach, font_size=16).shift(RIGHT * 2 + UP * (1 - i * 0.8))
            self.play(FadeIn(f, a), run_time=0.4)

        note = Text("VDOM isn't always faster — it's a tradeoff!", font_size=16, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(note))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
