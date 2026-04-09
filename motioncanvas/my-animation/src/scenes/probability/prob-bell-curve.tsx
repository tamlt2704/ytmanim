import {Rect, Txt, makeScene2D, Line, Circle, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, typeText, popIn, pulse, drawLine} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Bell Curve'} fill={GREEN} fontFamily={CODE_FONT} fontSize={95} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Normal Distribution'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);

  // Draw bell curve using line segments
  const curvePoints: [number, number][] = [];
  const cx = 0, cy = -300;
  const w = 600, h = 300;

  for (let i = 0; i <= 60; i++) {
    const t = (i / 60) * 6 - 3; // -3 to 3 std devs
    const x = cx - w / 2 + (i / 60) * w;
    const y = cy + h - h * Math.exp(-t * t / 2) * 0.95;
    curvePoints.push([x, y]);
  }

  const curve = createRef<Line>();
  view.add(
    <Line ref={curve} points={curvePoints} stroke={GREEN} lineWidth={5} end={0} opacity={1} />
  );

  // Baseline
  const baseline = createRef<Line>();
  view.add(
    <Line ref={baseline} points={[[cx - w / 2, cy + h], [cx + w / 2, cy + h]]} stroke={'#30363d'} lineWidth={2} opacity={0} />
  );

  yield* baseline().opacity(1, 0.2);
  yield* drawLine(curve(), 0.8);
  yield* waitFor(0.3);

  // Standard deviation labels
  const sdLabels = createRefArray<Txt>();
  const sdData = [
    {text: '-3\u03c3', x: cx - w / 2},
    {text: '-2\u03c3', x: cx - w / 3},
    {text: '-1\u03c3', x: cx - w / 6},
    {text: '\u03bc', x: cx},
    {text: '+1\u03c3', x: cx + w / 6},
    {text: '+2\u03c3', x: cx + w / 3},
    {text: '+3\u03c3', x: cx + w / 2},
  ];

  for (const sd of sdData) {
    view.add(<Txt ref={sdLabels} text={sd.text} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} x={sd.x} y={cy + h + 30} opacity={0} />);
  }
  for (const lbl of sdLabels) {
    yield* lbl.opacity(1, 0.05);
  }
  yield* waitFor(0.2);

  // 68-95-99.7 rule boxes
  const rules = createRefArray<Rect>();
  const ruleData = [
    {label: '68%', range: '\u00b11\u03c3', color: GREEN, y: -20},
    {label: '95%', range: '\u00b12\u03c3', color: ORANGE, y: 70},
    {label: '99.7%', range: '\u00b13\u03c3', color: RED, y: 160},
  ];

  for (const r of ruleData) {
    view.add(
      <Rect ref={rules} x={0} y={r.y} width={600} height={70} radius={14} fill={TERMINAL_BG} stroke={r.color} lineWidth={3} opacity={0} scale={0}>
        <Txt text={r.label} fill={r.color} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} x={-180} />
        <Txt text={`within ${r.range}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} x={100} />
      </Rect>
    );
  }

  for (let i = 0; i < 3; i++) {
    yield* all(rules[i].opacity(1, 0.2), rules[i].scale(1, 0.3, easeOutCubic));
    yield* waitFor(0.15);
  }
  yield* waitFor(0.3);

  // Key fact
  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'The 68-95-99.7 Rule'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={310} opacity={0} />);
  yield* fadeInUp(fact(), 20, 0.4);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Heights, test scores, measurement errors\nall follow the bell curve'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={520} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
