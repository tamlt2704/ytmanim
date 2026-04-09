import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeOutBack, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, CYAN} from '../../styles';

export default makeScene2D(function* (view) {
  // NO black screen — background is visible from frame 0
  view.fill(BG_COLOR);

  // ─── Static background elements (visible immediately) ───

  // Glow circles (ambient light)
  view.add(<Circle x={-200} y={-400} size={800} fill={ACCENT_COLOR} opacity={0.06} />);
  view.add(<Circle x={300} y={400} size={600} fill={PURPLE} opacity={0.05} />);

  // Corner accents
  view.add(<Rect x={-490} y={-910} width={200} height={200} rotation={45} fill={GREEN} opacity={0.08} radius={16} />);
  view.add(<Rect x={490} y={910} width={160} height={160} rotation={45} fill={ORANGE} opacity={0.08} radius={16} />);

  // Edge lines
  view.add(<Rect x={0} y={-958} width={1080} height={4} fill={GREEN} opacity={0.5} />);
  view.add(<Rect x={0} y={958} width={1080} height={4} fill={ACCENT_COLOR} opacity={0.5} />);
  view.add(<Rect x={-538} y={0} width={4} height={1920} fill={GREEN} opacity={0.25} />);
  view.add(<Rect x={538} y={0} width={4} height={1920} fill={ACCENT_COLOR} opacity={0.25} />);

  // Scattered geometry symbols in background (visible from start, subtle)
  const symbols = ['\u03c0', '\u25b3', '\u00b0', '\u03c6', 'r\u00b2', '\u221a', '\u2220', '\u221e', 'V-E+F'];
  const symColors = [GREEN, ORANGE, PURPLE, ACCENT_COLOR, RED, CYAN, GREEN, ORANGE, PURPLE];
  for (let i = 0; i < symbols.length; i++) {
    const x = -400 + (i % 5) * 200;
    const y = 600 + Math.floor(i / 5) * 80;
    view.add(<Txt text={symbols[i]} fill={symColors[i]} fontFamily={CODE_FONT} fontSize={28} opacity={0.12} x={x} y={y} />);
  }

  // ─── Animated elements ───

  // Big number "10" — starts visible but scales in
  const bigNum = createRef<Txt>();
  view.add(<Txt ref={bigNum} text={'10'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={280} fontWeight={900} y={-500} opacity={0.8} scale={0.5} letterSpacing={10} />);

  // Topic name
  const topic = createRef<Txt>();
  view.add(<Txt ref={topic} text={'GEOMETRY'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={900} y={-250} opacity={0} letterSpacing={8} />);

  // Subtitle
  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'SURPRISES'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-150} opacity={0} />);

  // Divider line
  const divider = createRef<Line>();
  view.add(<Line ref={divider} points={[[-200, -90], [200, -90]]} stroke={GREEN} lineWidth={4} opacity={0} />);

  // "Every Student" + "MUST KNOW"
  const line1 = createRef<Txt>();
  const line2 = createRef<Txt>();
  view.add(<Txt ref={line1} text={'Mind-Blowing Facts'} fill={'#8b949e'} fontFamily={TITLE_FONT} fontSize={48} fontWeight={700} y={-20} opacity={0} />);
  view.add(<Txt ref={line2} text={'VISUALIZED'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={64} fontWeight={900} y={60} opacity={0} />);

  // Animated badge
  const badge = createRef<Rect>();
  view.add(
    <Rect ref={badge} y={150} width={260} height={56} radius={28} fill={GREEN} opacity={0} scale={0}>
      <Txt text={'60 SECONDS'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} />
    </Rect>
  );

  // Geometry shapes floating (decorative)
  const triShape = createRef<Line>();
  const circShape = createRef<Circle>();
  const sqShape = createRef<Rect>();
  view.add(<Line ref={triShape} points={[[-60, 0], [60, 0], [0, -100]]} closed stroke={ORANGE} lineWidth={4} x={-300} y={350} opacity={0} scale={0} />);
  view.add(<Circle ref={circShape} x={0} y={380} size={120} stroke={ACCENT_COLOR} lineWidth={4} opacity={0} scale={0} />);
  view.add(<Rect ref={sqShape} x={300} y={350} width={90} height={90} stroke={PURPLE} lineWidth={4} rotation={15} opacity={0} scale={0} />);

  // ─── ANIMATION (fast, punchy — 3 seconds total) ───

  // Big number scales up immediately (no delay)
  yield* bigNum().scale(1, 0.5, easeOutBack);

  // Topic + subtitle slam in
  yield* all(
    topic().opacity(1, 0.3),
    topic().y(-250, 0.4, easeOutCubic),
  );
  yield* all(
    subtitle().opacity(1, 0.3),
    subtitle().y(-150, 0.3, easeOutCubic),
  );

  // Divider
  yield* divider().opacity(0.5, 0.2);

  // Text lines
  yield* all(line1().opacity(1, 0.3), line2().opacity(1, 0.3));

  // Badge pops
  yield* all(badge().opacity(1, 0.2), badge().scale(1, 0.4, easeOutBack));

  // Decorative shapes pop in
  yield* all(
    triShape().opacity(0.5, 0.2), triShape().scale(1, 0.3, easeOutCubic),
    circShape().opacity(0.5, 0.2), circShape().scale(1, 0.3, easeOutCubic),
    sqShape().opacity(0.5, 0.2), sqShape().scale(1, 0.3, easeOutCubic),
  );

  // Hold the splash for a beat
  yield* waitFor(1);

  // Fade everything out to transition to first content scene
  yield* all(
    bigNum().opacity(0, 0.4),
    topic().opacity(0, 0.4),
    subtitle().opacity(0, 0.4),
    divider().opacity(0, 0.3),
    line1().opacity(0, 0.3),
    line2().opacity(0, 0.3),
    badge().opacity(0, 0.3),
    triShape().opacity(0, 0.3),
    circShape().opacity(0, 0.3),
    sqShape().opacity(0, 0.3),
  );
});
