import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeOutBack, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, CYAN} from '../../styles';
import {fadeIn, fadeInUp, drawLine, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  // ─── SPLASH (visible from frame 0) ───

  // Ambient glow
  view.add(<Circle x={-200} y={-400} size={800} fill={ACCENT_COLOR} opacity={0.06} />);
  view.add(<Circle x={300} y={400} size={600} fill={PURPLE} opacity={0.05} />);

  // Edge accents
  view.add(<Rect x={0} y={-958} width={1080} height={4} fill={GREEN} opacity={0.5} />);
  view.add(<Rect x={0} y={958} width={1080} height={4} fill={ACCENT_COLOR} opacity={0.5} />);

  // Corner diamonds
  view.add(<Rect x={-490} y={-910} width={200} height={200} rotation={45} fill={GREEN} opacity={0.08} radius={16} />);
  view.add(<Rect x={490} y={910} width={160} height={160} rotation={45} fill={ORANGE} opacity={0.08} radius={16} />);

  // Splash elements — all start VISIBLE (opacity=1)
  const bigNum = createRef<Txt>();
  view.add(<Txt ref={bigNum} text={'10'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={280} fontWeight={900} y={-500} opacity={0.85} letterSpacing={10} />);

  const topic = createRef<Txt>();
  view.add(<Txt ref={topic} text={'GEOMETRY'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={900} y={-250} opacity={1} letterSpacing={8} />);

  const splashSub = createRef<Txt>();
  view.add(<Txt ref={splashSub} text={'SURPRISES'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-150} opacity={1} />);

  const divider = createRef<Line>();
  view.add(<Line ref={divider} points={[[-200, -90], [200, -90]]} stroke={GREEN} lineWidth={4} opacity={0.5} />);

  const line1 = createRef<Txt>();
  view.add(<Txt ref={line1} text={'Mind-Blowing Facts'} fill={'#8b949e'} fontFamily={TITLE_FONT} fontSize={48} fontWeight={700} y={-20} opacity={1} />);

  const line2 = createRef<Txt>();
  view.add(<Txt ref={line2} text={'VISUALIZED'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={64} fontWeight={900} y={60} opacity={1} />);

  const badge = createRef<Rect>();
  view.add(
    <Rect ref={badge} y={150} width={260} height={56} radius={28} fill={GREEN} opacity={1}>
      <Txt text={'60 SECONDS'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} />
    </Rect>
  );

  // Decorative shapes
  const triShape = createRef<Line>();
  const circShape = createRef<Circle>();
  const sqShape = createRef<Rect>();
  view.add(<Line ref={triShape} points={[[-60, 0], [60, 0], [0, -100]]} closed stroke={ORANGE} lineWidth={4} x={-300} y={350} opacity={0.5} />);
  view.add(<Circle ref={circShape} x={0} y={380} size={120} stroke={ACCENT_COLOR} lineWidth={4} opacity={0.5} />);
  view.add(<Rect ref={sqShape} x={300} y={350} width={90} height={90} stroke={PURPLE} lineWidth={4} rotation={15} opacity={0.5} />);

  // Scattered symbols
  const symbols = ['\u03c0', '\u25b3', '\u00b0', '\u03c6', 'r\u00b2', '\u221a', '\u2220', '\u221e', 'V-E+F'];
  const symColors = [GREEN, ORANGE, PURPLE, ACCENT_COLOR, RED, CYAN, GREEN, ORANGE, PURPLE];
  for (let i = 0; i < symbols.length; i++) {
    view.add(<Txt text={symbols[i]} fill={symColors[i]} fontFamily={CODE_FONT} fontSize={28} opacity={0.12} x={-400 + (i % 5) * 200} y={600 + Math.floor(i / 5) * 80} />);
  }

  // ─── HOLD SPLASH 1.5s ───
  yield* waitFor(1.5);

  // ─── TRANSITION: fade out splash, bring in content ───
  yield* all(
    bigNum().opacity(0, 0.4),
    topic().opacity(0, 0.4),
    splashSub().opacity(0, 0.4),
    divider().opacity(0, 0.3),
    line1().opacity(0, 0.3),
    line2().opacity(0, 0.3),
    badge().opacity(0, 0.3),
    triShape().opacity(0, 0.3),
    circShape().opacity(0, 0.3),
    sqShape().opacity(0, 0.3),
  );

  // ─── CONTENT: π is Everywhere ───

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'\u03c0 is Everywhere'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Circle
  const circle = createRef<Circle>();
  view.add(<Circle ref={circle} x={-200} y={-400} size={300} stroke={ACCENT_COLOR} lineWidth={6} opacity={0} />);
  yield* all(circle().opacity(1, 0.3), circle().scale(1, 0.4, easeOutCubic));

  // Diameter
  const diam = createRef<Line>();
  view.add(<Line ref={diam} points={[[-350, -400], [-50, -400]]} stroke={GREEN} lineWidth={5} end={0} opacity={1} />);
  const dLabel = createRef<Txt>();
  view.add(<Txt ref={dLabel} text={'d'} fill={GREEN} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={-200} y={-350} opacity={0} />);
  yield* drawLine(diam(), 0.4);
  yield* fadeIn(dLabel(), 0.2);

  // Unroll circumference
  const unroll = createRef<Line>();
  view.add(<Line ref={unroll} points={[[-400, -180], [-400 + 300 * Math.PI, -180]]} stroke={ACCENT_COLOR} lineWidth={6} end={0} opacity={1} />);
  const cLabel = createRef<Txt>();
  view.add(<Txt ref={cLabel} text={'C = \u03c0d'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={0} y={-130} opacity={0} />);
  yield* drawLine(unroll(), 0.6);
  yield* fadeIn(cLabel(), 0.3);

  // π value
  const piVal = createRef<Txt>();
  view.add(<Txt ref={piVal} text={'\u03c0 \u2248 3.14159265...'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={56} fontWeight={800} y={0} opacity={0} />);
  yield* fadeInUp(piVal(), 20, 0.4);
  yield* pulse(piVal() as any, 1.15, 0.3);

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Irrational: digits NEVER repeat\nor terminate!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={150} textAlign={'center'} lineHeight={50} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(1.5);
});
