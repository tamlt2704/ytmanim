from manim import *

class RaceCondition(Scene):
    def construct(self):
        title = Text("Race Condition Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        var = RoundedRectangle(corner_radius=0.15, width=2, height=1, color=YELLOW).shift(UP * 0)
        var_label = Text("count = 0", font_size=18, color=YELLOW).move_to(var)
        t1 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=BLUE).shift(LEFT * 3 + UP * 2)
        t1_label = Text("Thread 1", font_size=16).move_to(t1)
        t2 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN).shift(RIGHT * 3 + UP * 2)
        t2_label = Text("Thread 2", font_size=16).move_to(t2)
        self.play(FadeIn(var, var_label, t1, t1_label, t2, t2_label))

        steps = [
            ("Read: 0", t1, BLUE, LEFT * 3),
            ("Read: 0", t2, GREEN, RIGHT * 3),
            ("Write: 1", t1, BLUE, LEFT * 3),
            ("Write: 1", t2, GREEN, RIGHT * 3),
        ]

        for text, thread, color, pos in steps:
            arrow = Arrow(thread.get_bottom(), var.get_top(), buff=0.1, color=color, stroke_width=2)
            label = Text(text, font_size=14, color=color).shift(pos + DOWN * 0.5)
            self.play(GrowArrow(arrow), FadeIn(label), run_time=0.5)
            self.wait(0.3)
            self.play(FadeOut(arrow), run_time=0.2)

        wrong = Text("count = 1 (expected 2!)", font_size=24, color=RED).shift(DOWN * 2)
        self.play(Write(wrong))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Real-world example
        real_title = Text("Real-World Example: Bank Transfer", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(real_title))

        balance = Text("Balance: $1000", font_size=22, color=YELLOW).shift(UP * 1.2)
        self.play(Write(balance))

        scenario = [
            ("ATM 1: Read $1000", BLUE, LEFT * 3),
            ("ATM 2: Read $1000", GREEN, RIGHT * 3),
            ("ATM 1: Withdraw $500 → Write $500", BLUE, LEFT * 3),
            ("ATM 2: Withdraw $300 → Write $700", GREEN, RIGHT * 3),
        ]
        for i, (text, color, pos) in enumerate(scenario):
            txt = Text(text, font_size=14, color=color).shift(pos + UP * (0.2 - i * 0.5))
            self.play(FadeIn(txt), run_time=0.4)

        result = Text("Balance: $700 (should be $200!)", font_size=20, color=RED).shift(DOWN * 2)
        self.play(Write(result))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Prevention
        fix_title = Text("How to Prevent Race Conditions", font_size=28, color=GREEN).shift(UP * 2.5)
        self.play(Write(fix_title))

        fixes = [
            ("Mutex/Lock", "Only one thread accesses at a time", BLUE),
            ("Atomic operations", "Read-modify-write in one step", GREEN),
            ("Semaphore", "Control concurrent access count", ORANGE),
            ("Database locks", "SELECT ... FOR UPDATE", YELLOW),
            ("Optimistic locking", "Version check before write", PURPLE),
        ]
        for i, (name, desc, color) in enumerate(fixes):
            n = Text(f"✅ {name}", font_size=16, color=color).shift(LEFT * 2.5 + UP * (1 - i * 0.6))
            d = Text(desc, font_size=13).shift(RIGHT * 2 + UP * (1 - i * 0.6))
            self.play(FadeIn(n, d), run_time=0.35)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
