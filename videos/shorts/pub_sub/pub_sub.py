from manim import *

class PubSub(Scene):
    def construct(self):
        title = Text("Pub/Sub Pattern Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        pub = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=BLUE).shift(LEFT * 4)
        pub_label = Text("Publisher", font_size=16).move_to(pub)
        broker = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.5, color=YELLOW).shift(ORIGIN)
        broker_label = Text("Message\nBroker", font_size=14).move_to(broker)

        subs = VGroup()
        for i in range(3):
            s = RoundedRectangle(corner_radius=0.15, width=1.8, height=0.8, color=GREEN)
            s.shift(RIGHT * 4.5 + UP * (1.2 - i * 1.2))
            label = Text(f"Sub {i+1}", font_size=14).move_to(s)
            subs.add(VGroup(s, label))

        self.play(FadeIn(pub, pub_label, broker, broker_label, subs))

        for _ in range(2):
            msg = Dot(pub.get_center(), color=BLUE, radius=0.1)
            self.play(msg.animate.move_to(broker.get_center()), run_time=0.4)
            dots = [Dot(broker.get_center(), color=GREEN, radius=0.1) for _ in range(3)]
            self.play(*[d.animate.move_to(subs[i][0].get_center()) for i, d in enumerate(dots)], run_time=0.4)
            self.play(FadeOut(msg, *dots), run_time=0.2)

        decouple = Text("Decoupled communication ✓", font_size=20, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(decouple))
        self.wait(1)
        self.play(FadeOut(pub, pub_label, broker, broker_label, subs, decouple))

        # Topics/Channels
        topic_title = Text("Topics & Channels", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(topic_title))

        topics = [
            ("orders", ["Order Service", "Email Service", "Analytics"], BLUE),
            ("payments", ["Payment Service", "Notification"], GREEN),
        ]
        for i, (topic, subscribers, color) in enumerate(topics):
            t = RoundedRectangle(corner_radius=0.1, width=2, height=0.6, color=color, fill_opacity=0.3)
            t.shift(LEFT * 3 + UP * (0.5 - i * 1.5))
            t_lbl = Text(topic, font_size=14, color=color).move_to(t)
            self.play(FadeIn(t, t_lbl), run_time=0.3)
            for j, sub in enumerate(subscribers):
                s = Text(f"→ {sub}", font_size=12).shift(RIGHT * 1 + UP * (0.5 - i * 1.5 - j * 0.3))
                self.play(FadeIn(s), run_time=0.2)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Pub/Sub vs Message Queue
        vs_title = Text("Pub/Sub vs Message Queue", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(vs_title))

        ps = VGroup(
            Text("Pub/Sub", font_size=18, color=GREEN, weight=BOLD),
            Text("• Fan-out to all subscribers", font_size=14),
            Text("• Event-driven", font_size=14),
            Text("• Multiple consumers", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        mq = VGroup(
            Text("Message Queue", font_size=18, color=BLUE, weight=BOLD),
            Text("• Point-to-point delivery", font_size=14),
            Text("• Task distribution", font_size=14),
            Text("• Single consumer per message", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(ps), run_time=0.5)
        self.play(FadeIn(mq), run_time=0.5)

        tools = Text("Tools: Kafka, Redis Pub/Sub, SNS, Google Pub/Sub", font_size=14, color=GREY).shift(DOWN * 2.5)
        self.play(Write(tools))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
