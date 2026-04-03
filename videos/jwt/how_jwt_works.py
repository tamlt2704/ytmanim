from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class HowJWTWorks(Scene):
    def construct(self):
        self.add_sound(MUSIC)

        title = Text("How JWT Tokens Work", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        parts = [
            ("Header", '{"alg":"HS256","typ":"JWT"}', RED),
            ("Payload", '{"sub":"1234","name":"User"}', PURPLE),
            ("Signature", "HMACSHA256(header + payload, secret)", BLUE),
        ]

        jwt_parts = VGroup()
        for i, (name, content, color) in enumerate(parts):
            box = RoundedRectangle(corner_radius=0.2, width=4, height=1.2, color=color, fill_opacity=0.2)
            box.shift(UP * (1.5 - i * 1.5))
            name_text = Text(name, font_size=22, color=color, weight=BOLD).next_to(box, LEFT, buff=0.3)
            content_text = Text(content, font_size=14).move_to(box)
            group = VGroup(box, name_text, content_text)
            jwt_parts.add(group)
            self.play(FadeIn(group), run_time=0.6)
            self.wait(0.3)

        self.wait(1)

        dot1 = Text(".", font_size=48, color=WHITE).shift(UP * 0.75)
        dot2 = Text(".", font_size=48, color=WHITE).shift(DOWN * 0.75)

        # Compact into token
        self.play(
            jwt_parts[0].animate.scale(0.6).move_to(LEFT * 2.5 + UP * 0.3),
            jwt_parts[1].animate.scale(0.6).move_to(ORIGIN + UP * 0.3),
            jwt_parts[2].animate.scale(0.6).move_to(RIGHT * 2.5 + UP * 0.3),
            FadeIn(dot1, dot2),
            run_time=0.8,
        )

        token_label = Text("eyJhbG...  .  eyJzdW...  .  SflKxw...", font_size=18, color=YELLOW).shift(DOWN * 1.5)
        self.play(Write(token_label))
        self.wait(2)

        all_objs = VGroup(jwt_parts, dot1, dot2, token_label)
        self.play(FadeOut(all_objs))
