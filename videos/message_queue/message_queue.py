from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class MessageQueue(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Message Queues Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        producer = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=BLUE).shift(LEFT * 4.5)
        prod_label = Text("Producer", font_size=16).move_to(producer)
        consumer = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=GREEN).shift(RIGHT * 4.5)
        cons_label = Text("Consumer", font_size=16).move_to(consumer)

        # Queue
        queue_boxes = VGroup()
        for i in range(5):
            box = Rectangle(width=0.8, height=0.6, color=YELLOW, fill_opacity=0.1)
            box.shift(LEFT * 1.6 + RIGHT * i * 0.8)
            queue_boxes.add(box)
        queue_label = Text("Queue", font_size=16, color=YELLOW).next_to(queue_boxes, UP, buff=0.2)

        self.play(FadeIn(producer, prod_label, consumer, cons_label, queue_boxes, queue_label))

        # Enqueue messages
        for i in range(3):
            msg = Square(side_length=0.4, color=BLUE, fill_opacity=0.5)
            msg.move_to(producer)
            self.play(msg.animate.move_to(queue_boxes[i]), run_time=0.4)

        self.wait(0.3)

        # Dequeue messages
        for i in range(3):
            msg = Square(side_length=0.4, color=GREEN, fill_opacity=0.5).move_to(queue_boxes[i])
            self.play(msg.animate.move_to(consumer), run_time=0.4)
            self.play(FadeOut(msg), run_time=0.1)

        async_label = Text("Async processing ✓", font_size=22, color=GREEN).shift(DOWN * 2)
        self.play(Write(async_label))
        self.wait(2)
