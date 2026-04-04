from manim import *

class PrototypeChain(Scene):
    def construct(self):
        title = Text("Prototype Chain Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        objs = [
            ("myObj", '{ name: "A" }', BLUE),
            ("Person.prototype", "{ greet() }", GREEN),
            ("Object.prototype", "{ toString() }", ORANGE),
            ("null", "", RED),
        ]

        boxes = VGroup()
        arrows = VGroup()
        for i, (name, props, color) in enumerate(objs):
            box = RoundedRectangle(corner_radius=0.15, width=3.5, height=0.9, color=color, fill_opacity=0.2)
            box.shift(UP * (2 - i * 1.3))
            n = Text(name, font_size=16, color=color, weight=BOLD).move_to(box).shift(LEFT * 0.5)
            p = Text(props, font_size=12).move_to(box).shift(RIGHT * 0.7)
            group = VGroup(box, n, p)
            boxes.add(group)
            self.play(FadeIn(group), run_time=0.4)
            if i > 0:
                arrow = Arrow(boxes[i - 1][0].get_bottom(), box.get_top(), buff=0.1, color=WHITE, stroke_width=2)
                proto = Text("__proto__", font_size=10, color=GREY).next_to(arrow, RIGHT, buff=0.05)
                arrows.add(VGroup(arrow, proto))
                self.play(GrowArrow(arrow), FadeIn(proto), run_time=0.3)

        lookup = Text("Property lookup goes UP the chain", font_size=18, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(lookup))
        self.wait(1)
        self.play(FadeOut(boxes, arrows, lookup))

        # Lookup example
        ex_title = Text("Property Lookup Example", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(ex_title))

        steps = [
            ("myObj.name", "Found on myObj ✓", GREEN, "Direct property"),
            ("myObj.greet()", "Not on myObj → Person.prototype ✓", BLUE, "Inherited"),
            ("myObj.toString()", "Not on myObj → Person → Object ✓", ORANGE, "Inherited"),
            ("myObj.foo", "Not found anywhere → undefined", RED, "End of chain"),
        ]
        for i, (call, result, color, note) in enumerate(steps):
            c = Text(call, font_size=16, color=color, font="Monospace").shift(LEFT * 2.5 + UP * (1 - i * 0.8))
            r = Text(result, font_size=13).shift(RIGHT * 1.5 + UP * (1.1 - i * 0.8))
            n = Text(note, font_size=11, color=GREY).shift(RIGHT * 1.5 + UP * (0.7 - i * 0.8))
            self.play(FadeIn(c, r, n), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Class syntax
        class_title = Text("Modern Class Syntax", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(class_title))

        old_code = VGroup(
            Text("// Old way (prototype)", font_size=14, color=GREY),
            Text("function Person(name) {", font_size=14, color=RED, font="Monospace"),
            Text("  this.name = name", font_size=14, font="Monospace"),
            Text("}", font_size=14, color=RED, font="Monospace"),
            Text("Person.prototype.greet = ...", font_size=14, font="Monospace"),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        new_code = VGroup(
            Text("// New way (class)", font_size=14, color=GREY),
            Text("class Person {", font_size=14, color=GREEN, font="Monospace"),
            Text("  constructor(name) {", font_size=14, font="Monospace"),
            Text("    this.name = name", font_size=14, font="Monospace"),
            Text("  }", font_size=14, font="Monospace"),
            Text("  greet() { ... }", font_size=14, font="Monospace"),
            Text("}", font_size=14, color=GREEN, font="Monospace"),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(old_code), run_time=0.5)
        self.play(FadeIn(new_code), run_time=0.5)

        note = Text("Classes are syntactic sugar over prototypes!", font_size=16, color=YELLOW).shift(DOWN * 3)
        self.play(Write(note))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
