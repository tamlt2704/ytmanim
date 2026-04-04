from manim import *

class DesignPatterns(Scene):
    def construct(self):
        title = Text("3 Design Patterns Every Dev Needs", font_size=44)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        patterns = [
            ("Singleton", "One instance only", BLUE,
             ["Class", "→ instance", "→ same instance"],
             "Database connection pool, Logger, Config"),
            ("Observer", "Subscribe to events", GREEN,
             ["Subject", "→ notify()", "→ Observer 1, 2, 3"],
             "Event systems, UI updates, Pub/Sub"),
            ("Factory", "Create without specifying class", ORANGE,
             ["Factory", "→ create(type)", "→ ProductA / ProductB"],
             "Object creation, Plugin systems, APIs"),
        ]

        for name, desc, color, flow, use_case in patterns:
            header = Text(name, font_size=32, color=color, weight=BOLD).shift(UP * 2.5)
            subtitle = Text(desc, font_size=18).shift(UP * 1.5)
            self.play(Write(header), FadeIn(subtitle), run_time=0.5)

            flow_items = VGroup()
            for i, step in enumerate(flow):
                box = RoundedRectangle(corner_radius=0.15, width=2.5, height=0.7, color=color, fill_opacity=0.2)
                box.shift(LEFT * 3 + RIGHT * i * 3)
                txt = Text(step, font_size=14, color=color).move_to(box)
                flow_items.add(VGroup(box, txt))
            self.play(FadeIn(flow_items), run_time=0.5)

            use = Text(f"Use: {use_case}", font_size=14, color=GREY).shift(DOWN * 1.5)
            self.play(FadeIn(use), run_time=0.3)
            self.wait(1.5)
            self.play(FadeOut(header, subtitle, flow_items, use), run_time=0.3)

        # Singleton code example
        sing_title = Text("Singleton Example", font_size=28, color=BLUE).shift(UP * 2.5)
        self.play(Write(sing_title))
        sing_code = VGroup(
            Text("class Database:", font_size=16, color=BLUE, font="Monospace"),
            Text("    _instance = None", font_size=16, color=YELLOW, font="Monospace"),
            Text("    def get_instance(cls):", font_size=16, font="Monospace"),
            Text("        if not cls._instance:", font_size=16, font="Monospace"),
            Text("            cls._instance = Database()", font_size=16, color=GREEN, font="Monospace"),
            Text("        return cls._instance", font_size=16, color=GREEN, font="Monospace"),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 1 + DOWN * 0.2)
        self.play(FadeIn(sing_code), run_time=0.6)
        self.wait(1.5)
        self.play(FadeOut(sing_title, sing_code))

        # Observer code example
        obs_title = Text("Observer Example", font_size=28, color=GREEN).shift(UP * 2.5)
        self.play(Write(obs_title))

        subject = RoundedRectangle(corner_radius=0.15, width=2.5, height=1, color=GREEN).shift(LEFT * 3)
        sub_lbl = Text("Subject\n(YouTube)", font_size=14).move_to(subject)
        observers = VGroup()
        for i in range(3):
            o = RoundedRectangle(corner_radius=0.1, width=2, height=0.7, color=BLUE, fill_opacity=0.2)
            o.shift(RIGHT * 3 + UP * (1 - i * 1))
            lbl = Text(f"Subscriber {i+1}", font_size=12).move_to(o)
            observers.add(VGroup(o, lbl))
        self.play(FadeIn(subject, sub_lbl, observers))

        for o in observers:
            a = Arrow(subject.get_right(), o[0].get_left(), buff=0.1, color=YELLOW, stroke_width=2)
            self.play(GrowArrow(a), run_time=0.2)

        notify = Text("New video → all subscribers notified!", font_size=16, color=YELLOW).shift(DOWN * 2)
        self.play(Write(notify))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
