import { makeScene2D, Rect, Txt, Line, Circle, Node } from "@motion-canvas/2d";
import {
  all,
  chain,
  waitFor,
  createRef,
  createRefArray,
  Vector2,
  easeInOutCubic,
  Color,
} from "@motion-canvas/core";

const BG = "#1e1e2e";
const BLUE = "#89b4fa";
const GREEN = "#a6e3a1";
const YELLOW = "#f9e2af";
const RED = "#f38ba8";
const ORANGE = "#fab387";
const PURPLE = "#cba6f7";
const TEAL = "#94e2d5";
const WHITE = "#cdd6f4";
const GREY = "#585b70";

function* fadeIn(node: Node, duration = 0.3) {
  node.opacity(0);
  yield* node.opacity(1, duration);
}

function* fadeOut(node: Node, duration = 0.3) {
  yield* node.opacity(0, duration);
}

export default makeScene2D(function* (view) {
  view.fill(BG);

  // ── Title ──
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Git Commands You Didn't Know"
      fontSize={56}
      fontFamily="JetBrains Mono, monospace"
      fill={WHITE}
      opacity={0}
    />
  );
  yield* title().opacity(1, 0.6);
  yield* waitFor(1);
  yield* title().opacity(0, 0.4);
  title().remove();

  // ═══════════════════════════════════════
  // 1. git stash
  // ═══════════════════════════════════════
  {
    const container = createRef<Node>();
    const sectionTitle = createRef<Txt>();
    const workingBox = createRef<Rect>();
    const stashBox = createRef<Rect>();
    const cleanBox = createRef<Rect>();
    const arrow1 = createRef<Line>();
    const arrow2 = createRef<Line>();
    const a1Label = createRef<Txt>();
    const a2Label = createRef<Txt>();
    const useCase = createRef<Txt>();

    view.add(
      <Node ref={container} opacity={0}>
        <Txt
          ref={sectionTitle}
          text="git stash"
          fontSize={42}
          fontFamily="JetBrains Mono, monospace"
          fill={BLUE}
          y={-300}
        />

        {/* Working Directory */}
        <Rect
          ref={workingBox}
          x={-350}
          width={220}
          height={110}
          radius={12}
          stroke={GREEN}
          lineWidth={2}
          fill={new Color(GREEN).alpha(0.15)}
        >
          <Txt
            text={"Working\nDirectory"}
            fontSize={18}
            fontFamily="JetBrains Mono, monospace"
            fill={WHITE}
            textAlign="center"
          />
        </Rect>

        {/* Stash Stack */}
        <Rect
          ref={stashBox}
          x={0}
          width={220}
          height={110}
          radius={12}
          stroke={YELLOW}
          lineWidth={2}
          fill={new Color(YELLOW).alpha(0.15)}
        >
          <Txt
            text={"Stash\nStack"}
            fontSize={18}
            fontFamily="JetBrains Mono, monospace"
            fill={WHITE}
            textAlign="center"
          />
        </Rect>

        {/* Clean Branch */}
        <Rect
          ref={cleanBox}
          x={350}
          width={220}
          height={110}
          radius={12}
          stroke={BLUE}
          lineWidth={2}
          fill={new Color(BLUE).alpha(0.15)}
        >
          <Txt
            text={"Clean\nBranch"}
            fontSize={18}
            fontFamily="JetBrains Mono, monospace"
            fill={WHITE}
            textAlign="center"
          />
        </Rect>

        {/* Arrows */}
        <Line
          ref={arrow1}
          points={[new Vector2(-230, 0), new Vector2(-120, 0)]}
          stroke={YELLOW}
          lineWidth={3}
          endArrow
          end={0}
        />
        <Txt
          ref={a1Label}
          text="stash"
          fontSize={16}
          fontFamily="JetBrains Mono, monospace"
          fill={YELLOW}
          x={-175}
          y={-35}
          opacity={0}
        />

        <Line
          ref={arrow2}
          points={[new Vector2(120, 0), new Vector2(230, 0)]}
          stroke={BLUE}
          lineWidth={3}
          endArrow
          end={0}
        />
        <Txt
          ref={a2Label}
          text="stash pop"
          fontSize={16}
          fontFamily="JetBrains Mono, monospace"
          fill={BLUE}
          x={175}
          y={-35}
          opacity={0}
        />

        <Txt
          ref={useCase}
          text="Save work without committing"
          fontSize={20}
          fontFamily="JetBrains Mono, monospace"
          fill={GREEN}
          y={200}
          opacity={0}
        />
      </Node>
    );

    yield* fadeIn(container(), 0.5);
    yield* all(arrow1().end(1, 0.4), a1Label().opacity(1, 0.3));
    yield* all(arrow2().end(1, 0.4), a2Label().opacity(1, 0.3));
    yield* useCase().opacity(1, 0.4);
    yield* waitFor(1.5);
    yield* fadeOut(container(), 0.4);
    container().remove();
  }

  // ═══════════════════════════════════════
  // 2. git bisect
  // ═══════════════════════════════════════
  {
    const container = createRef<Node>();
    const dots = createRefArray<Circle>();
    const highlight = createRef<Rect>();
    const hlLabel = createRef<Txt>();
    const note = createRef<Txt>();

    const colors = [GREEN, GREEN, GREEN, GREY, GREY, RED, RED, RED];
    const spacing = 100;
    const startX = -350;

    view.add(
      <Node ref={container} opacity={0}>
        <Txt
          text="git bisect"
          fontSize={42}
          fontFamily="JetBrains Mono, monospace"
          fill={GREEN}
          y={-300}
        />

        <Line
          points={[
            new Vector2(startX, 0),
            new Vector2(startX + 7 * spacing, 0),
          ]}
          stroke={GREY}
          lineWidth={2}
        />

        {colors.map((c, i) => (
          <Circle
            ref={dots}
            x={startX + i * spacing}
            size={30}
            fill={c}
          />
        ))}

        <Txt
          text="good"
          fontSize={16}
          fontFamily="JetBrains Mono, monospace"
          fill={GREEN}
          x={startX}
          y={35}
        />
        <Txt
          text="bad"
          fontSize={16}
          fontFamily="JetBrains Mono, monospace"
          fill={RED}
          x={startX + 7 * spacing}
          y={35}
        />

        <Rect
          ref={highlight}
          x={startX + 3 * spacing}
          width={50}
          height={50}
          radius={8}
          stroke={YELLOW}
          lineWidth={2}
          opacity={0}
        />
        <Txt
          ref={hlLabel}
          text="test here"
          fontSize={16}
          fontFamily="JetBrains Mono, monospace"
          fill={YELLOW}
          x={startX + 3 * spacing}
          y={-45}
          opacity={0}
        />

        <Txt
          ref={note}
          text="Binary search through commits — O(log n)"
          fontSize={20}
          fontFamily="JetBrains Mono, monospace"
          fill={GREEN}
          y={200}
          opacity={0}
        />
      </Node>
    );

    yield* fadeIn(container(), 0.5);
    yield* all(highlight().opacity(1, 0.3), hlLabel().opacity(1, 0.3));
    yield* waitFor(0.5);

    // narrow down
    yield* all(
      highlight().x(startX + 4 * spacing, 0.4),
      hlLabel().x(startX + 4 * spacing, 0.4),
      hlLabel().text("narrow down", 0.3)
    );
    yield* waitFor(0.5);

    // found bug
    yield* all(
      highlight().x(startX + 5 * spacing, 0.4),
      hlLabel().x(startX + 5 * spacing, 0.4),
      hlLabel().text("found bug!", 0.3),
      hlLabel().fill(RED, 0.3)
    );
    yield* note().opacity(1, 0.4);
    yield* waitFor(1.5);
    yield* fadeOut(container(), 0.4);
    container().remove();
  }

  // ═══════════════════════════════════════
  // 3. git reflog
  // ═══════════════════════════════════════
  {
    const container = createRef<Node>();
    const entries = createRefArray<Txt>();
    const rescueBox = createRef<Rect>();
    const rescueLabel = createRef<Txt>();
    const note = createRef<Txt>();

    const lines = [
      "HEAD@{0}: commit: fix bug",
      "HEAD@{1}: reset: moving to HEAD~1",
      "HEAD@{2}: commit: add feature",
      "HEAD@{3}: checkout: moving to main",
    ];

    view.add(
      <Node ref={container} opacity={0}>
        <Txt
          text="git reflog"
          fontSize={42}
          fontFamily="JetBrains Mono, monospace"
          fill={ORANGE}
          y={-300}
        />

        {lines.map((line, i) => (
          <Txt
            ref={entries}
            text={line}
            fontSize={20}
            fontFamily="JetBrains Mono, monospace"
            fill={i === 2 ? ORANGE : WHITE}
            y={-60 + i * 50}
            opacity={0}
          />
        ))}

        <Rect
          ref={rescueBox}
          y={-60 + 2 * 50}
          width={460}
          height={40}
          radius={6}
          stroke={GREEN}
          lineWidth={2}
          opacity={0}
        />
        <Txt
          ref={rescueLabel}
          text="← recover this!"
          fontSize={18}
          fontFamily="JetBrains Mono, monospace"
          fill={GREEN}
          x={320}
          y={-60 + 2 * 50}
          opacity={0}
        />

        <Txt
          ref={note}
          text="Undo accidental resets & deletes"
          fontSize={20}
          fontFamily="JetBrains Mono, monospace"
          fill={ORANGE}
          y={220}
          opacity={0}
        />
      </Node>
    );

    yield* fadeIn(container(), 0.4);
    for (const entry of entries) {
      yield* entry.opacity(1, 0.2);
    }
    yield* all(rescueBox().opacity(1, 0.3), rescueLabel().opacity(1, 0.3));
    yield* note().opacity(1, 0.4);
    yield* waitFor(1.5);
    yield* fadeOut(container(), 0.4);
    container().remove();
  }

  // ═══════════════════════════════════════
  // 4. git cherry-pick
  // ═══════════════════════════════════════
  {
    const container = createRef<Node>();
    const pickArrow = createRef<Line>();
    const pickLabel = createRef<Txt>();
    const note = createRef<Txt>();

    const mainY = -40;
    const featY = 100;
    const mainDots = 5;
    const featDots = 4;
    const sx = -400;
    const sp = 160;

    view.add(
      <Node ref={container} opacity={0}>
        <Txt
          text="git cherry-pick"
          fontSize={42}
          fontFamily="JetBrains Mono, monospace"
          fill={RED}
          y={-300}
        />

        {/* Branch lines */}
        <Line
          points={[
            new Vector2(sx, mainY),
            new Vector2(sx + (mainDots - 1) * sp, mainY),
          ]}
          stroke={BLUE}
          lineWidth={3}
        />
        <Txt
          text="main"
          fontSize={16}
          fontFamily="JetBrains Mono, monospace"
          fill={BLUE}
          x={sx - 50}
          y={mainY}
        />

        <Line
          points={[
            new Vector2(sx + sp, featY),
            new Vector2(sx + featDots * sp, featY),
          ]}
          stroke={GREEN}
          lineWidth={3}
        />
        <Txt
          text="feature"
          fontSize={16}
          fontFamily="JetBrains Mono, monospace"
          fill={GREEN}
          x={sx + sp - 65}
          y={featY}
        />

        {/* Main dots */}
        {Array.from({ length: mainDots }, (_, i) => (
          <Circle x={sx + i * sp} y={mainY} size={24} fill={BLUE} />
        ))}

        {/* Feature dots */}
        {Array.from({ length: featDots }, (_, i) => (
          <Circle
            x={sx + (i + 1) * sp}
            y={featY}
            size={24}
            fill={i === 2 ? YELLOW : GREEN}
          />
        ))}

        {/* Cherry-pick arrow */}
        <Line
          ref={pickArrow}
          points={[
            new Vector2(sx + 3 * sp, featY - 15),
            new Vector2(sx + 4 * sp, mainY + 15),
          ]}
          stroke={YELLOW}
          lineWidth={3}
          endArrow
          end={0}
        />
        <Txt
          ref={pickLabel}
          text="cherry-pick"
          fontSize={16}
          fontFamily="JetBrains Mono, monospace"
          fill={YELLOW}
          x={sx + 4 * sp + 80}
          y={(mainY + featY) / 2}
          opacity={0}
        />

        <Txt
          ref={note}
          text="Pick specific commits from any branch"
          fontSize={20}
          fontFamily="JetBrains Mono, monospace"
          fill={RED}
          y={250}
          opacity={0}
        />
      </Node>
    );

    yield* fadeIn(container(), 0.5);
    yield* all(pickArrow().end(1, 0.5), pickLabel().opacity(1, 0.4));
    yield* note().opacity(1, 0.4);
    yield* waitFor(1.5);
    yield* fadeOut(container(), 0.4);
    container().remove();
  }

  // ═══════════════════════════════════════
  // 5. git blame
  // ═══════════════════════════════════════
  {
    const container = createRef<Node>();
    const blameLines = createRefArray<Txt>();
    const blameHl = createRef<Rect>();
    const blameNote = createRef<Txt>();

    const data = [
      "a1b2c3d  Alice  const x = 1",
      "e4f5g6h  Bob    const y = 2",
      "i7j8k9l  Alice  return x+y",
    ];

    view.add(
      <Node ref={container} opacity={0}>
        <Txt
          text="git blame"
          fontSize={42}
          fontFamily="JetBrains Mono, monospace"
          fill={PURPLE}
          y={-300}
        />

        {data.map((line, i) => (
          <Txt
            ref={blameLines}
            text={line}
            fontSize={20}
            fontFamily="JetBrains Mono, monospace"
            fill={i === 1 ? PURPLE : WHITE}
            y={-30 + i * 50}
            opacity={0}
          />
        ))}

        <Rect
          ref={blameHl}
          y={-30 + 50}
          width={440}
          height={40}
          radius={6}
          stroke={YELLOW}
          lineWidth={2}
          opacity={0}
        />
        <Txt
          ref={blameNote}
          text="Who wrote this line?"
          fontSize={18}
          fontFamily="JetBrains Mono, monospace"
          fill={YELLOW}
          x={310}
          y={-30 + 50}
          opacity={0}
        />
      </Node>
    );

    yield* fadeIn(container(), 0.4);
    for (const line of blameLines) {
      yield* line.opacity(1, 0.2);
    }
    yield* all(blameHl().opacity(1, 0.3), blameNote().opacity(1, 0.3));
    yield* waitFor(1.5);
    yield* fadeOut(container(), 0.4);
    container().remove();
  }

  // ═══════════════════════════════════════
  // 6. git worktree
  // ═══════════════════════════════════════
  {
    const container = createRef<Node>();
    const dashLine = createRef<Line>();
    const shared = createRef<Txt>();

    view.add(
      <Node ref={container} opacity={0}>
        <Txt
          text="git worktree"
          fontSize={42}
          fontFamily="JetBrains Mono, monospace"
          fill={TEAL}
          y={-300}
        />

        <Rect
          x={-250}
          width={260}
          height={140}
          radius={12}
          stroke={BLUE}
          lineWidth={2}
          fill={new Color(BLUE).alpha(0.12)}
        >
          <Txt
            text={"main\n(worktree 1)"}
            fontSize={18}
            fontFamily="JetBrains Mono, monospace"
            fill={WHITE}
            textAlign="center"
          />
        </Rect>

        <Rect
          x={250}
          width={260}
          height={140}
          radius={12}
          stroke={GREEN}
          lineWidth={2}
          fill={new Color(GREEN).alpha(0.12)}
        >
          <Txt
            text={"feature\n(worktree 2)"}
            fontSize={18}
            fontFamily="JetBrains Mono, monospace"
            fill={WHITE}
            textAlign="center"
          />
        </Rect>

        <Line
          ref={dashLine}
          points={[new Vector2(-110, 0), new Vector2(110, 0)]}
          stroke={YELLOW}
          lineWidth={2}
          lineDash={[10, 6]}
          end={0}
        />

        <Txt
          ref={shared}
          text="Same .git — no stashing needed!"
          fontSize={20}
          fontFamily="JetBrains Mono, monospace"
          fill={TEAL}
          y={150}
          opacity={0}
        />
      </Node>
    );

    yield* fadeIn(container(), 0.5);
    yield* dashLine().end(1, 0.4);
    yield* shared().opacity(1, 0.4);
    yield* waitFor(1.5);
    yield* fadeOut(container(), 0.4);
    container().remove();
  }

  // ── Outro ──
  const outro = createRef<Txt>();
  view.add(
    <Txt
      ref={outro}
      text="Now go try them! 🚀"
      fontSize={52}
      fontFamily="JetBrains Mono, monospace"
      fill={YELLOW}
      opacity={0}
    />
  );
  yield* outro().opacity(1, 0.6);
  yield* waitFor(2);
  yield* outro().opacity(0, 0.4);
});
