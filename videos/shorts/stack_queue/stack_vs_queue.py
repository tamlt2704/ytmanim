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

        self.wait(2)
