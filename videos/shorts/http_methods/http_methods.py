from manim import *

class HTTPMethods(Scene):
    def construct(self):
        title = Text("HTTP Methods Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        methods = [
            ("GET", "Read data", GREEN),
            ("POST", "Create data", BLUE),
            ("PUT", "Replace data", YELLOW),
            ("PATCH", "Update partial", ORANGE),
            ("DELETE", "Remove data", RED),
        ]

        boxes = VGroup()
        for i, (method, desc, color) in enumerate(methods):
            box = RoundedRectangle(corner_radius=0.15, width=5, height=0.7, color=color, fill_opacity=0.2)
            box.shift(UP * (2 - i * 0.9))
            m = Text(method, font_size=22, color=color, weight=BOLD).move_to(box).shift(LEFT * 1.2)
            d = Text(desc, font_size=16).move_to(box).shift(RIGHT * 1)
            group = VGroup(box, m, d)
            boxes.add(group)
            self.play(FadeIn(group), run_time=0.5)

        self.wait(1.5)
        self.play(FadeOut(boxes))

        # Detailed examples
        detail_title = Text("REST API Examples", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(detail_title))

        examples = [
            ("GET", "/users", "List all users", GREEN),
            ("GET", "/users/1", "Get user #1", GREEN),
            ("POST", "/users", "Create new user", BLUE),
            ("PUT", "/users/1", "Replace user #1", YELLOW),
            ("PATCH", "/users/1", "Update user #1 name", ORANGE),
            ("DELETE", "/users/1", "Delete user #1", RED),
        ]
        for i, (method, path, desc, color) in enumerate(examples):
            m = Text(method, font_size=14, color=color, weight=BOLD).shift(LEFT * 4 + UP * (1.8 - i * 0.6))
            p = Text(path, font_size=14, font="Monospace").shift(LEFT * 1.5 + UP * (1.8 - i * 0.6))
            d = Text(desc, font_size=14, color=GREY).shift(RIGHT * 2.5 + UP * (1.8 - i * 0.6))
            self.play(FadeIn(m, p, d), run_time=0.35)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Idempotency
        idem_title = Text("Idempotent Methods", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(idem_title))

        idem_note = Text("Same request multiple times = same result", font_size=18, color=YELLOW).shift(UP * 1.5)
        self.play(Write(idem_note))

        idem_data = [
            ("GET", "✅ Idempotent", GREEN),
            ("PUT", "✅ Idempotent", GREEN),
            ("DELETE", "✅ Idempotent", GREEN),
            ("POST", "❌ Not idempotent", RED),
            ("PATCH", "⚠️ Depends", YELLOW),
        ]
        for i, (method, status, color) in enumerate(idem_data):
            m = Text(method, font_size=18, weight=BOLD).shift(LEFT * 2 + UP * (0.5 - i * 0.6))
            s = Text(status, font_size=16, color=color).shift(RIGHT * 2 + UP * (0.5 - i * 0.6))
            self.play(FadeIn(m, s), run_time=0.35)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
