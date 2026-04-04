from manim import *

class DockerVsVM(Scene):
    def construct(self):

        title = Text("Docker vs VM", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # VM stack
        vm_title = Text("Virtual Machine", font_size=24, color=ORANGE).shift(LEFT * 3 + UP * 3)
        vm_layers = []
        vm_labels = ["Hardware", "Hypervisor", "Guest OS", "Bins/Libs", "App"]
        vm_colors = [GREY, ORANGE, RED, YELLOW, GREEN]
        for i, (label, color) in enumerate(zip(vm_labels, vm_colors)):
            rect = Rectangle(width=3, height=0.6, color=color, fill_opacity=0.3).shift(LEFT * 3 + DOWN * 1.5 + UP * i * 0.7)
            txt = Text(label, font_size=16).move_to(rect)
            vm_layers.append(VGroup(rect, txt))

        # Docker stack
        dk_title = Text("Docker", font_size=24, color=BLUE).shift(RIGHT * 3 + UP * 3)
        dk_layers = []
        dk_labels = ["Hardware", "Host OS", "Docker Engine", "App"]
        dk_colors = [GREY, BLUE, TEAL, GREEN]
        for i, (label, color) in enumerate(zip(dk_labels, dk_colors)):
            rect = Rectangle(width=3, height=0.6, color=color, fill_opacity=0.3).shift(RIGHT * 3 + DOWN * 1.5 + UP * i * 0.7)
            txt = Text(label, font_size=16).move_to(rect)
            dk_layers.append(VGroup(rect, txt))

        self.play(Write(vm_title), Write(dk_title))
        for vm, dk in zip(vm_layers, dk_layers):
            self.play(FadeIn(vm), FadeIn(dk), run_time=0.5)
        for vm in vm_layers[len(dk_layers):]:
            self.play(FadeIn(vm), run_time=0.5)

        self.wait(1)

        heavy = Text("Heavy & Slow", font_size=20, color=RED).next_to(vm_layers[-1], UP, buff=0.3)
        light = Text("Light & Fast", font_size=20, color=GREEN).next_to(dk_layers[-1], UP, buff=0.3)
        self.play(Write(heavy), Write(light))
        self.wait(1.5)

        all_objs = VGroup(vm_title, dk_title, heavy, light, *vm_layers, *dk_layers)
        self.play(FadeOut(all_objs))

        # Size comparison
        size_title = Text("Size Comparison", font_size=32, color=YELLOW).shift(UP * 2.5)
        self.play(Write(size_title))

        vm_bar = Rectangle(width=5, height=0.6, color=ORANGE, fill_opacity=0.4).shift(LEFT * 0.5 + UP * 1)
        vm_size = Text("VM: ~1-10 GB", font_size=16, color=ORANGE).next_to(vm_bar, RIGHT, buff=0.2)
        dk_bar = Rectangle(width=1.5, height=0.6, color=BLUE, fill_opacity=0.4).shift(LEFT * 2.25 + DOWN * 0)
        dk_size = Text("Container: ~10-100 MB", font_size=16, color=BLUE).next_to(dk_bar, RIGHT, buff=0.2)
        self.play(FadeIn(vm_bar, vm_size), run_time=0.5)
        self.play(FadeIn(dk_bar, dk_size), run_time=0.5)
        self.wait(1)

        # Startup time
        vm_start = Text("VM boot: minutes", font_size=16, color=RED).shift(DOWN * 1.5)
        dk_start = Text("Container start: seconds", font_size=16, color=GREEN).shift(DOWN * 2.2)
        self.play(Write(vm_start), run_time=0.4)
        self.play(Write(dk_start), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(size_title, vm_bar, vm_size, dk_bar, dk_size, vm_start, dk_start))

        # When to use
        when_title = Text("When to Use", font_size=32, color=TEAL).shift(UP * 2.5)
        self.play(Write(when_title))

        vm_uses = VGroup(
            Text("VMs:", font_size=20, color=ORANGE, weight=BOLD),
            Text("• Different OS needed", font_size=16),
            Text("• Full isolation required", font_size=16),
            Text("• Legacy applications", font_size=16),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        dk_uses = VGroup(
            Text("Docker:", font_size=20, color=BLUE, weight=BOLD),
            Text("• Microservices", font_size=16),
            Text("• CI/CD pipelines", font_size=16),
            Text("• Dev environments", font_size=16),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(vm_uses), run_time=0.6)
        self.play(FadeIn(dk_uses), run_time=0.6)
        self.wait(2)
        self.play(FadeOut(when_title, vm_uses, dk_uses))
