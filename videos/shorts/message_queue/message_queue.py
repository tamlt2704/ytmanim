from manim import *

class MessageQueue(Scene):
    def construct(self):
        title = Text("Message Queues Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        producer = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=BLUE).shift(LEFT * 4.5)
        prod_label = Text("Producer", font_size=16).move_to(producer)
        consumer = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=GREEN).shift(RIGHT * 4.5)
        cons_label = Text("Consumer", font_size=16).move_to(consumer)

        queue_boxes = VGroup()
        for i in range(5):
            box = Rectangle(width=0.8, height=0.6, color=YELLOW, fill_opacity=0.1)
            box.shift(LEFT * 1.6 + RIGHT * i * 0.8)
            queue_boxes.add(box)
        queue_label = Text("Queue", font_size=16, color=YELLOW).next_to(queue_boxes, UP, buff=0.2)

        self.play(FadeIn(producer, prod_label, consumer, cons_label, queue_boxes, queue_label))

        for i in range(3):
            msg = Square(side_length=0.4, color=BLUE, fill_opacity=0.5)
            msg.move_to(producer)
            self.play(msg.animate.move_to(queue_boxes[i]), run_time=0.4)

        self.wait(0.3)

        for i in range(3):
            msg = Square(side_length=0.4, color=GREEN, fill_opacity=0.5).move_to(queue_boxes[i])
            self.play(msg.animate.move_to(consumer), run_time=0.4)
            self.play(FadeOut(msg), run_time=0.1)

        async_label = Text("Async processing ✓", font_size=22, color=GREEN).shift(DOWN * 2)
        self.play(Write(async_label))
        self.wait(1)
        self.play(FadeOut(producer, prod_label, consumer, cons_label, queue_boxes, queue_label, async_label))

        # Benefits
        ben_title = Text("Why Message Queues?", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(ben_title))

        benefits = [
            ("Decoupling", "Producer & consumer independent", BLUE),
            ("Buffering", "Handle traffic spikes", GREEN),
            ("Reliability", "Messages persist until processed", ORANGE),
            ("Scaling", "Add more consumers as needed", PURPLE),
            ("Ordering", "FIFO guarantees (optional)", TEAL),
        ]
        for i, (name, desc, color) in enumerate(benefits):
            n = Text(f"✅ {name}", font_size=18, color=color).shift(LEFT * 2.5 + UP * (1 - i * 0.6))
            d = Text(desc, font_size=14).shift(RIGHT * 2 + UP * (1 - i * 0.6))
            self.play(FadeIn(n, d), run_time=0.35)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Use cases
        use_title = Text("Real-World Use Cases", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(use_title))

        uses = [
            ("Email sending", "Queue emails, send async"),
            ("Order processing", "Queue orders, process in background"),
            ("Log aggregation", "Collect logs from many services"),
            ("Video encoding", "Queue uploads, encode later"),
        ]
        for i, (use, desc) in enumerate(uses):
            u = Text(f"• {use}", font_size=18, color=YELLOW).shift(LEFT * 1.5 + UP * (1 - i * 0.8))
            d = Text(desc, font_size=14, color=GREY).next_to(u, DOWN, buff=0.05, aligned_edge=LEFT)
            self.play(FadeIn(u, d), run_time=0.4)

        tools = Text("Tools: RabbitMQ, Kafka, SQS, Redis Streams", font_size=16, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(tools))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
