from manim import *

class Encryption(Scene):
    def construct(self):
        title = Text("Encryption Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Symmetric
        sym_label = Text("Symmetric Encryption", font_size=22, color=BLUE).shift(UP * 2.5)
        self.play(Write(sym_label))
        plain1 = Text("Hello", font_size=22, color=GREEN).shift(LEFT * 4 + UP * 1.2)
        key1 = Text("🔑 Same Key", font_size=16, color=YELLOW).shift(UP * 1.2)
        cipher1 = Text("x#k@!", font_size=22, color=RED).shift(RIGHT * 4 + UP * 1.2)
        a1 = Arrow(plain1.get_right(), key1.get_left(), buff=0.2, color=GREEN, stroke_width=2)
        a2 = Arrow(key1.get_right(), cipher1.get_left(), buff=0.2, color=RED, stroke_width=2)
        self.play(FadeIn(plain1), GrowArrow(a1), FadeIn(key1), GrowArrow(a2), FadeIn(cipher1), run_time=0.8)
        sym_ex = Text("AES, DES, ChaCha20", font_size=14, color=BLUE).shift(UP * 0.5)
        self.play(Write(sym_ex), run_time=0.3)

        sym_note = Text("Fast! Same key encrypts & decrypts", font_size=14, color=GREEN).shift(DOWN * 0)
        self.play(Write(sym_note), run_time=0.3)
        self.wait(1)

        # Asymmetric
        asym_label = Text("Asymmetric Encryption", font_size=22, color=GREEN).shift(DOWN * 1)
        self.play(Write(asym_label))
        plain2 = Text("Hello", font_size=22, color=GREEN).shift(LEFT * 4 + DOWN * 2)
        pub_key = Text("🔓 Public Key", font_size=14, color=ORANGE).shift(LEFT * 0.5 + DOWN * 1.7)
        priv_key = Text("🔐 Private Key", font_size=14, color=PURPLE).shift(RIGHT * 1 + DOWN * 2.3)
        cipher2 = Text("y&m!@", font_size=22, color=RED).shift(RIGHT * 4 + DOWN * 2)
        b1 = Arrow(plain2.get_right(), pub_key.get_left(), buff=0.1, color=GREEN, stroke_width=2)
        b2 = Arrow(pub_key.get_right(), cipher2.get_left(), buff=0.1, color=RED, stroke_width=2)
        self.play(FadeIn(plain2, pub_key, priv_key), GrowArrow(b1), GrowArrow(b2), FadeIn(cipher2), run_time=0.8)
        asym_ex = Text("RSA, ECC, Ed25519", font_size=14, color=GREEN).shift(DOWN * 3)
        self.play(Write(asym_ex), run_time=0.3)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Comparison
        comp_title = Text("Symmetric vs Asymmetric", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(comp_title))

        headers = VGroup(
            Text("", font_size=14).shift(LEFT * 3),
            Text("Symmetric", font_size=16, color=BLUE, weight=BOLD),
            Text("Asymmetric", font_size=16, color=GREEN, weight=BOLD).shift(RIGHT * 3.5),
        ).shift(UP * 2)
        self.play(FadeIn(headers), run_time=0.3)

        rows = [
            ("Keys", "1 shared key", "Public + Private"),
            ("Speed", "Very fast", "Slower"),
            ("Key exchange", "Hard problem", "Easy (public key)"),
            ("Use case", "Bulk data", "Key exchange, signing"),
        ]
        for i, (label, sym, asym) in enumerate(rows):
            row = VGroup(
                Text(label, font_size=14, weight=BOLD).shift(LEFT * 3),
                Text(sym, font_size=14, color=BLUE),
                Text(asym, font_size=14, color=GREEN).shift(RIGHT * 3.5),
            ).shift(UP * (1.2 - i * 0.7))
            self.play(FadeIn(row), run_time=0.35)

        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # How HTTPS uses both
        both_title = Text("HTTPS Uses Both!", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(both_title))

        step1 = Text("1. Asymmetric: exchange session key", font_size=18, color=GREEN).shift(UP * 1)
        step2 = Text("2. Symmetric: encrypt all data with session key", font_size=18, color=BLUE).shift(UP * 0)
        step3 = Text("Best of both worlds: secure + fast!", font_size=20, color=YELLOW).shift(DOWN * 1.5)

        self.play(Write(step1), run_time=0.5)
        self.play(Write(step2), run_time=0.5)
        self.play(Write(step3), run_time=0.5)
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
