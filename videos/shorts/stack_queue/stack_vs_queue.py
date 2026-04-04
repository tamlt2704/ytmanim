from manim import *

class StackVsQueue(Scene):
    def construct(self):
        title = Text("Stack vs Queue", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Stack - LIFO
        stack_title = Text("Stack (LIFO)", font_size=24, color=BLUE).shift(LEFT * 3 + UP * 2.5)
        self.play(Write(stack_title))
        stack_items = VGroup()
        for i in range(4):
            rect = Rectangle(width=2, height=0.5, color=BLUE, fill_opacity=0.3)
            rect.shift(LEFT * 3 + DOWN * 1 + UP * i * 0.55)
            txt = Text(str(i + 1), font_size=16).move_to(rect)
            stack_items.add(VGroup(rect, txt))
            self.play(FadeIn(stack_items[i]), run_time=0.3)

        pop_arrow = Arrow(LEFT * 1.5 + UP * 0.65, LEFT * 0.5 + UP * 0.65, color=RED)
        pop_label = Text("pop", font_size=16, color=RED).next_to(pop_arrow, RIGHT, buff=0.1)
        self.play(GrowArrow(pop_arrow), FadeIn(pop_label), run_time=0.4)
        self.play(FadeOut(stack_items[3], pop_arrow, pop_label), run_time=0.4)

        # Queue - FIFO
        queue_title = Text("Queue (FIFO)", font_size=24, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(queue_title))
        queue_items = VGroup()
        for i in range(4):
            rect = Rectangle(width=0.8, height=0.6, color=GREEN, fill_opacity=0.3)
            rect.shift(RIGHT * (1.5 + i * 0.9) + DOWN * 0.5)
            txt = Text(str(i + 1), font_size=16).move_to(rect)
            queue_items.add(VGroup(rect, txt))
            self.play(FadeIn(queue_items[i]), run_time=0.3)

        deq_arrow = Arrow(RIGHT * 1.5 + DOWN * 1.3, RIGHT * 1.5 + DOWN * 2, color=RED)
        deq_label = Text("dequeue", font_size=16, color=RED).next_to(deq_arrow, RIGHT, buff=0.1)
        self.play(GrowArrow(deq_arrow), FadeIn(deq_label), run_time=0.4)
        self.play(FadeOut(queue_items[0], deq_arrow, deq_label), run_time=0.4)

        self.wait(1)
        self.play(FadeOut(stack_title, stack_items, queue_title, queue_items))

        # Real-world examples
        ex_title = Text("Real-World Examples", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(ex_title))

        stack_ex = VGroup(
            Text("Stack:", font_size=18, color=BLUE, weight=BOLD),
            Text("• Undo/Redo (Ctrl+Z)", font_size=14),
            Text("• Browser back button", font_size=14),
            Text("• Function call stack", font_size=14),
            Text("• Expression evaluation", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        queue_ex = VGroup(
            Text("Queue:", font_size=18, color=GREEN, weight=BOLD),
            Text("• Print queue", font_size=14),
            Text("• Task scheduling", font_size=14),
            Text("• BFS traversal", font_size=14),
            Text("• Message queues", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(stack_ex), run_time=0.5)
        self.play(FadeIn(queue_ex), run_time=0.5)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Operations & complexity
        ops_title = Text("Operations", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(ops_title))

        stack_ops = VGroup(
            Text("Stack Operations:", font_size=16, color=BLUE, weight=BOLD),
            Text("push(item)  — O(1)", font_size=14, font="Monospace"),
            Text("pop()       — O(1)", font_size=14, font="Monospace"),
            Text("peek()      — O(1)", font_size=14, font="Monospace"),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        queue_ops = VGroup(
            Text("Queue Operations:", font_size=16, color=GREEN, weight=BOLD),
            Text("enqueue(item) — O(1)", font_size=14, font="Monospace"),
            Text("dequeue()     — O(1)", font_size=14, font="Monospace"),
            Text("peek()        — O(1)", font_size=14, font="Monospace"),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(stack_ops), run_time=0.5)
        self.play(FadeIn(queue_ops), run_time=0.5)

        note = Text("Both are O(1) for all core operations!", font_size=16, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(note))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
