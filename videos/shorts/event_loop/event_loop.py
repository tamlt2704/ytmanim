from manim import *

class EventLoop(Scene):
    def construct(self):
        title = Text("Event Loop Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        stack = RoundedRectangle(corner_radius=0.15, width=2.5, height=3, color=BLUE, fill_opacity=0.1).shift(LEFT * 4)
        stack_label = Text("Call Stack", font_size=16, color=BLUE).next_to(stack, UP, buff=0.1)
        queue = RoundedRectangle(corner_radius=0.15, width=2.5, height=1.5, color=GREEN, fill_opacity=0.1).shift(RIGHT * 4 + DOWN * 1)
        queue_label = Text("Callback Queue", font_size=14, color=GREEN).next_to(queue, UP, buff=0.1)
        apis = RoundedRectangle(corner_radius=0.15, width=2.5, height=1.5, color=ORANGE, fill_opacity=0.1).shift(RIGHT * 4 + UP * 1.5)
        apis_label = Text("Web APIs", font_size=14, color=ORANGE).next_to(apis, UP, buff=0.1)
        loop = Circle(radius=0.5, color=YELLOW).shift(ORIGIN)
        loop_label = Text("Event\nLoop", font_size=12, color=YELLOW).move_to(loop)

        self.play(FadeIn(stack, stack_label, queue, queue_label, apis, apis_label, loop, loop_label))

        # Animate flow
        a1 = Arrow(stack.get_right(), apis.get_left(), buff=0.1, color=ORANGE, stroke_width=2)
        l1 = Text("setTimeout", font_size=12, color=ORANGE).next_to(a1, UP, buff=0.05)
        self.play(GrowArrow(a1), FadeIn(l1), run_time=0.5)

        a2 = Arrow(apis.get_bottom(), queue.get_top(), buff=0.1, color=GREEN, stroke_width=2)
        l2 = Text("callback", font_size=12, color=GREEN).next_to(a2, RIGHT, buff=0.05)
        self.play(GrowArrow(a2), FadeIn(l2), run_time=0.5)

        self.play(Rotate(loop, angle=2 * PI), run_time=0.8)
        a3 = Arrow(queue.get_left(), stack.get_right(), buff=0.1, color=YELLOW, stroke_width=2).shift(DOWN * 0.5)
        l3 = Text("push to stack", font_size=12, color=YELLOW).next_to(a3, DOWN, buff=0.05)
        self.play(GrowArrow(a3), FadeIn(l3), run_time=0.5)

        self.wait(1)
        self.play(FadeOut(stack, stack_label, queue, queue_label, apis, apis_label,
                          loop, loop_label, a1, l1, a2, l2, a3, l3))

        # Step by step example
        ex_title = Text("Example: setTimeout", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(ex_title))

        code_lines = [
            ("console.log('1')", BLUE, "→ Call Stack → prints 1"),
            ("setTimeout(() => log('2'), 0)", ORANGE, "→ Web API → Queue"),
            ("console.log('3')", BLUE, "→ Call Stack → prints 3"),
            ("// stack empty", GREY, "→ Event Loop checks queue"),
            ("callback: log('2')", GREEN, "→ Call Stack → prints 2"),
        ]

        for i, (code, color, desc) in enumerate(code_lines):
            c = Text(code, font_size=14, color=color, font="Monospace").shift(LEFT * 2.5 + UP * (1.5 - i * 0.7))
            d = Text(desc, font_size=12, color=GREY).next_to(c, RIGHT, buff=0.3)
            self.play(FadeIn(c, d), run_time=0.4)
            self.wait(0.3)

        output = Text("Output: 1, 3, 2  (not 1, 2, 3!)", font_size=20, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(output))
        self.wait(1.5)
        self.play(FadeOut(ex_title, output, *self.mobjects))

        # Microtask vs Macrotask
        micro_title = Text("Microtasks vs Macrotasks", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(micro_title))

        micro = VGroup(
            Text("Microtasks (higher priority):", font_size=16, color=GREEN, weight=BOLD),
            Text("• Promises (.then)", font_size=14),
            Text("• queueMicrotask()", font_size=14),
            Text("• MutationObserver", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        macro = VGroup(
            Text("Macrotasks:", font_size=16, color=ORANGE, weight=BOLD),
            Text("• setTimeout", font_size=14),
            Text("• setInterval", font_size=14),
            Text("• I/O, UI rendering", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(micro), run_time=0.5)
        self.play(FadeIn(macro), run_time=0.5)
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
