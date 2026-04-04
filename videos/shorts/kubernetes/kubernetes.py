from manim import *

class KubernetesExplained(Scene):
    def construct(self):
        title = Text("Kubernetes in 60 Seconds", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        cluster = RoundedRectangle(corner_radius=0.3, width=11, height=5, color=BLUE, fill_opacity=0.05)
        cluster_label = Text("Cluster", font_size=20, color=BLUE).next_to(cluster, UP, buff=0.1)
        self.play(FadeIn(cluster, cluster_label))

        nodes = VGroup()
        for i in range(3):
            node = RoundedRectangle(corner_radius=0.2, width=3, height=3.5, color=GREEN, fill_opacity=0.1)
            node.shift(LEFT * 3.5 + RIGHT * i * 3.5 + DOWN * 0.3)
            node_label = Text(f"Node {i+1}", font_size=14, color=GREEN).next_to(node, UP, buff=0.05)
            pods = VGroup()
            for j in range(2):
                pod = RoundedRectangle(corner_radius=0.1, width=2.2, height=0.7, color=ORANGE, fill_opacity=0.2)
                pod.move_to(node).shift(UP * (0.5 - j * 1))
                pod_label = Text("Pod", font_size=12, color=ORANGE).move_to(pod)
                pods.add(VGroup(pod, pod_label))
            nodes.add(VGroup(node, node_label, pods))

        for node in nodes:
            self.play(FadeIn(node), run_time=0.5)

        svc = Text("Service → Load Balance across Pods", font_size=18, color=YELLOW).shift(DOWN * 2.8)
        self.play(Write(svc))
        self.wait(1.5)
        self.play(FadeOut(cluster, cluster_label, nodes, svc))

        # Key concepts
        concepts_title = Text("Key Concepts", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(concepts_title))

        concepts = [
            ("Pod", "Smallest unit, runs containers", ORANGE),
            ("Node", "Machine (VM or physical)", GREEN),
            ("Cluster", "Group of nodes", BLUE),
            ("Service", "Stable network endpoint", YELLOW),
            ("Deployment", "Manages pod replicas", PURPLE),
            ("Namespace", "Virtual cluster isolation", TEAL),
        ]
        for i, (name, desc, color) in enumerate(concepts):
            n = Text(name, font_size=18, color=color, weight=BOLD).shift(LEFT * 3 + UP * (1.5 - i * 0.6))
            d = Text(desc, font_size=14).shift(RIGHT * 1.5 + UP * (1.5 - i * 0.6))
            self.play(FadeIn(n, d), run_time=0.35)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Self-healing
        heal_title = Text("Self-Healing", font_size=28, color=GREEN).shift(UP * 2.5)
        self.play(Write(heal_title))

        pod_ok = RoundedRectangle(corner_radius=0.1, width=1.5, height=0.8, color=GREEN, fill_opacity=0.3).shift(LEFT * 3)
        pod_ok_lbl = Text("Pod ✓", font_size=14, color=GREEN).move_to(pod_ok)
        pod_dead = RoundedRectangle(corner_radius=0.1, width=1.5, height=0.8, color=RED, fill_opacity=0.3).shift(ORIGIN)
        pod_dead_lbl = Text("Pod ✗", font_size=14, color=RED).move_to(pod_dead)
        pod_new = RoundedRectangle(corner_radius=0.1, width=1.5, height=0.8, color=YELLOW, fill_opacity=0.3).shift(RIGHT * 3)
        pod_new_lbl = Text("New Pod ✓", font_size=14, color=YELLOW).move_to(pod_new)

        self.play(FadeIn(pod_ok, pod_ok_lbl, pod_dead, pod_dead_lbl))
        crash = Text("💥 Pod crashes", font_size=16, color=RED).shift(DOWN * 1.5)
        self.play(Write(crash))
        self.wait(0.5)

        replace_arrow = Arrow(pod_dead.get_right(), pod_new.get_left(), buff=0.1, color=YELLOW, stroke_width=3)
        self.play(GrowArrow(replace_arrow), FadeIn(pod_new, pod_new_lbl), run_time=0.5)
        auto = Text("K8s auto-replaces failed pods!", font_size=18, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(auto))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Scaling
        scale_title = Text("Auto-Scaling", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(scale_title))

        for count in [2, 4, 6]:
            pods = VGroup()
            for i in range(count):
                p = RoundedRectangle(corner_radius=0.1, width=1.2, height=0.6, color=ORANGE, fill_opacity=0.3)
                p.shift(LEFT * 3 + RIGHT * (i % 3) * 1.5 + UP * (0.5 - (i // 3) * 0.8))
                lbl = Text("Pod", font_size=10, color=ORANGE).move_to(p)
                pods.add(VGroup(p, lbl))
            count_lbl = Text(f"{count} replicas", font_size=18, color=YELLOW).shift(DOWN * 1.5)
            self.play(FadeIn(pods, count_lbl), run_time=0.5)
            self.wait(0.5)
            self.play(FadeOut(pods, count_lbl), run_time=0.3)

        scale_note = Text("Scale up/down based on CPU, memory, or custom metrics", font_size=16, color=GREEN).shift(DOWN * 1)
        self.play(Write(scale_note))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
