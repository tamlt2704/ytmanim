from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class PubSub(Scene):
    def construct(self):
        self.add_sound(MUSIC)
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

        # Publish
        for _ in range(2):
            msg = Dot(pub.get_center(), color=BLUE, radius=0.1)
            self.play(msg.animate.move_to(broker.get_center()), run_time=0.4)
            # Fan out
            dots = [Dot(broker.get_center(), color=GREEN, radius=0.1) for _ in range(3)]
            self.play(*[d.animate.move_to(subs[i][0].get_center()) for i, d in enumerate(dots)], run_time=0.4)
            self.play(FadeOut(msg, *dots), run_time=0.2)

        decouple = Text("Decoupled communication ✓", font_size=20, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(decouple))
        self.wait(2)
