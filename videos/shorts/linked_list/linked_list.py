from manim import *

class LinkedList(Scene):
    def construct(self):
        title = Text("Linked List Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        nodes = VGroup()
        arrows = VGroup()
        values = ["A", "B", "C", "D"]

        for i, val in enumerate(values):
            box = RoundedRectangle(corner_radius=0.1, width=1.2, height=0.8, color=BLUE, fill_opacity=0.2)
            box.shift(LEFT * 3 + RIGHT * i * 2)
            txt = Text(val, font_size=22, color=BLUE).move_to(box)
            node = VGroup(box, txt)
            nodes.add(node)
            self.play(FadeIn(node), run_time=0.3)
            if i > 0:
                arrow = Arrow(nodes[i - 1][0].get_right(), box.get_left(), buff=0.1, color=WHITE, stroke_width=2)
                arrows.add(arrow)
                self.play(GrowArrow(arrow), run_time=0.2)

        null = Text("NULL", font_size=16, color=RED).next_to(nodes[-1], RIGHT, buff=0.5)
        null_arrow = Arrow(nodes[-1][0].get_right(), null.get_left(), buff=0.1, color=RED, stroke_width=2)
        self.play(GrowArrow(null_arrow), FadeIn(null), run_time=0.3)
        self.wait(0.5)

        head = Text("head", font_size=16, color=GREEN).next_to(nodes[0], UP, buff=0.3)
        head_arrow = Arrow(head.get_bottom(), nodes[0][0].get_top(), buff=0.05, color=GREEN, stroke_width=2)
        self.play(FadeIn(head), GrowArrow(head_arrow), run_time=0.4)

        self.wait(1)

        # Insert node
        new_node_box = RoundedRectangle(corner_radius=0.1, width=1.2, height=0.8, color=YELLOW, fill_opacity=0.3)
        new_node_box.shift(DOWN * 1.5 + LEFT * 1)
        new_txt = Text("X", font_size=22, color=YELLOW).move_to(new_node_box)
        insert_label = Text("Insert X after B", font_size=18, color=YELLOW).shift(DOWN * 2.8)
        self.play(FadeIn(new_node_box, new_txt), Write(insert_label), run_time=0.5)
        self.play(new_node_box.animate.move_to(LEFT * 1 + UP * 0), new_txt.animate.move_to(LEFT * 1 + UP * 0), run_time=0.5)

        self.wait(2)
