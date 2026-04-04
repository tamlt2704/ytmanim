from manim import *

class HowJWTWorks(Scene):
    def construct(self):

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

        self.play(
            jwt_parts[0].animate.scale(0.6).move_to(LEFT * 2.5 + UP * 0.3),
            jwt_parts[1].animate.scale(0.6).move_to(ORIGIN + UP * 0.3),
            jwt_parts[2].animate.scale(0.6).move_to(RIGHT * 2.5 + UP * 0.3),
            FadeIn(dot1, dot2),
            run_time=0.8,
        )

        token_label = Text("eyJhbG...  .  eyJzdW...  .  SflKxw...", font_size=18, color=YELLOW).shift(DOWN * 1.5)
        self.play(Write(token_label))
        self.wait(1.5)

        all_objs = VGroup(jwt_parts, dot1, dot2, token_label)
        self.play(FadeOut(all_objs))

        # JWT Flow
        flow_title = Text("JWT Authentication Flow", font_size=32, color=YELLOW).shift(UP * 2.8)
        self.play(Write(flow_title))

        client = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=BLUE).shift(LEFT * 4)
        cl = Text("Client", font_size=16).move_to(client)
        server = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN).shift(RIGHT * 4)
        sl = Text("Server", font_size=16).move_to(server)
        self.play(FadeIn(client, cl, server, sl))

        flow_steps = [
            (client, server, "Login (user/pass)", BLUE),
            (server, client, "JWT token", GREEN),
            (client, server, "Request + JWT", YELLOW),
            (server, client, "Protected data", GREEN),
        ]
        for src, dst, label, color in flow_steps:
            a = Arrow(src.get_right(), dst.get_left(), buff=0.1, color=color, stroke_width=2)
            l = Text(label, font_size=12, color=color).next_to(a, UP, buff=0.05)
            self.play(GrowArrow(a), FadeIn(l), run_time=0.5)
            self.wait(0.5)
            self.play(FadeOut(a, l), run_time=0.2)

        self.play(FadeOut(flow_title, client, cl, server, sl))

        # Pros and Cons
        pc_title = Text("JWT: Pros & Cons", font_size=32, color=TEAL).shift(UP * 2.5)
        self.play(Write(pc_title))

        pros = VGroup(
            Text("✅ Stateless", font_size=18, color=GREEN),
            Text("✅ Scalable", font_size=18, color=GREEN),
            Text("✅ Cross-domain", font_size=18, color=GREEN),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        cons = VGroup(
            Text("❌ Can't revoke easily", font_size=18, color=RED),
            Text("❌ Payload is readable", font_size=18, color=RED),
            Text("❌ Size overhead", font_size=18, color=RED),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(pros), run_time=0.6)
        self.play(FadeIn(cons), run_time=0.6)
        self.wait(2)
        self.play(FadeOut(pc_title, pros, cons))
