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

        self.wait(1)
        self.play(FadeOut(nodes, arrows, null, null_arrow, head, head_arrow,
                          new_node_box, new_txt, insert_label))

        # Array vs Linked List
        comp_title = Text("Array vs Linked List", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(comp_title))

        headers = VGroup(
            Text("", font_size=14).shift(LEFT * 3.5),
            Text("Array", font_size=16, color=BLUE, weight=BOLD),
            Text("Linked List", font_size=16, color=GREEN, weight=BOLD).shift(RIGHT * 3.5),
        ).shift(UP * 2)
        self.play(FadeIn(headers), run_time=0.3)

        rows = [
            ("Access", "O(1)", "O(n)"),
            ("Insert (start)", "O(n)", "O(1)"),
            ("Insert (end)", "O(1)*", "O(n) or O(1)**"),
            ("Delete", "O(n)", "O(1)***"),
            ("Memory", "Contiguous", "Scattered"),
        ]
        for i, (label, arr, ll) in enumerate(rows):
            row = VGroup(
                Text(label, font_size=13, weight=BOLD).shift(LEFT * 3.5),
                Text(arr, font_size=13, color=BLUE),
                Text(ll, font_size=13, color=GREEN).shift(RIGHT * 3.5),
            ).shift(UP * (1.2 - i * 0.6))
            self.play(FadeIn(row), run_time=0.35)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Types of linked lists
        types_title = Text("Types of Linked Lists", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(types_title))

        # Singly
        singly_lbl = Text("Singly Linked", font_size=18, color=BLUE).shift(UP * 1.5 + LEFT * 3)
        s_nodes = VGroup()
        for i in range(3):
            d = Dot(LEFT * 1 + RIGHT * i * 1.5 + UP * 1.5, color=BLUE, radius=0.12)
            s_nodes.add(d)
        s_arrows = VGroup(*[Arrow(s_nodes[i].get_right(), s_nodes[i+1].get_left(), buff=0.1, color=BLUE, stroke_width=2) for i in range(2)])
        self.play(FadeIn(singly_lbl, s_nodes, s_arrows), run_time=0.5)

        # Doubly
        doubly_lbl = Text("Doubly Linked", font_size=18, color=GREEN).shift(UP * 0 + LEFT * 3)
        d_nodes = VGroup()
        for i in range(3):
            d = Dot(LEFT * 1 + RIGHT * i * 1.5, color=GREEN, radius=0.12)
            d_nodes.add(d)
        d_arrows = VGroup()
        for i in range(2):
            d_arrows.add(Arrow(d_nodes[i].get_right(), d_nodes[i+1].get_left(), buff=0.1, color=GREEN, stroke_width=2).shift(UP * 0.05))
            d_arrows.add(Arrow(d_nodes[i+1].get_left(), d_nodes[i].get_right(), buff=0.1, color=YELLOW, stroke_width=2).shift(DOWN * 0.05))
        self.play(FadeIn(doubly_lbl, d_nodes, d_arrows), run_time=0.5)

        # Circular
        circ_lbl = Text("Circular", font_size=18, color=ORANGE).shift(DOWN * 1.5 + LEFT * 3)
        c_nodes = VGroup()
        for i in range(3):
            d = Dot(LEFT * 1 + RIGHT * i * 1.5 + DOWN * 1.5, color=ORANGE, radius=0.12)
            c_nodes.add(d)
        c_arrows = VGroup(*[Arrow(c_nodes[i].get_right(), c_nodes[i+1].get_left(), buff=0.1, color=ORANGE, stroke_width=2) for i in range(2)])
        c_back = CurvedArrow(c_nodes[2].get_top(), c_nodes[0].get_top(), color=RED, angle=-1)
        self.play(FadeIn(circ_lbl, c_nodes, c_arrows), Create(c_back), run_time=0.5)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
