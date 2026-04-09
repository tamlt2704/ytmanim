import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#4 Merge Sort'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Helper to create a box
  const makeBox = (text: string, x: number, y: number, color: string, w = 160) => {
    const ref = createRef<Rect>();
    view.add(
      <Rect ref={ref} width={w} height={55} radius={12} fill={color + '22'} stroke={color} lineWidth={3} x={x} y={y} opacity={0} scale={0}>
        <Txt text={text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} />
      </Rect>,
    );
    return ref;
  };
  const makeLine = (from: [number, number], to: [number, number]) => {
    const ref = createRef<Line>();
    view.add(<Line ref={ref} points={[from, to]} stroke={'#30363d'} lineWidth={2} end={0} />);
    return ref;
  };

  // === DIVIDE PHASE ===
  const divLabel = createRef<Txt>();
  view.add(<Txt ref={divLabel} text={'DIVIDE ✂️'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={30} fontWeight={900} x={320} y={-620} opacity={0} />);
  yield* fadeIn(divLabel(), 0.2);

  // Level 0: [5, 3, 8, 1]
  const l0 = makeBox('5  3  8  1', 0, -620, ACCENT_COLOR, 300);
  yield* all(l0().opacity(1, 0.2), l0().scale(1, 0.3, easeOutBack));

  // Lines L0 → L1
  const ln0L = makeLine([- 60, -590], [-130, -550]);
  const ln0R = makeLine([60, -590], [130, -550]);
  yield* all(ln0L().end(1, 0.2), ln0R().end(1, 0.2));

  // Level 1: [5,3] and [8,1]
  const l1a = makeBox('5  3', -130, -520, ORANGE);
  const l1b = makeBox('8  1', 130, -520, ORANGE);
  yield* all(l1a().opacity(1, 0.15), l1a().scale(1, 0.25, easeOutBack), l1b().opacity(1, 0.15), l1b().scale(1, 0.25, easeOutBack));

  // Lines L1 → L2
  const ln1aL = makeLine([-170, -490], [-210, -450]);
  const ln1aR = makeLine([-90, -490], [-50, -450]);
  const ln1bL = makeLine([90, -490], [50, -450]);
  const ln1bR = makeLine([170, -490], [210, -450]);
  yield* all(ln1aL().end(1, 0.15), ln1aR().end(1, 0.15), ln1bL().end(1, 0.15), ln1bR().end(1, 0.15));

  // Level 2: individual elements
  const l2 = [
    makeBox('5', -210, -420, PURPLE, 60),
    makeBox('3', -50, -420, PURPLE, 60),
    makeBox('8', 50, -420, PURPLE, 60),
    makeBox('1', 210, -420, PURPLE, 60),
  ];
  yield* all(...l2.map(r => all(r().opacity(1, 0.12), r().scale(1, 0.2, easeOutBack))));
  yield* waitFor(0.3);

  // === MERGE PHASE ===
  const mergeLabel = createRef<Txt>();
  view.add(<Txt ref={mergeLabel} text={'MERGE 🔗'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={30} fontWeight={900} x={320} y={-300} opacity={0} />);
  yield* fadeIn(mergeLabel(), 0.2);

  // Lines L2 → M1
  const lnM1aL = makeLine([-210, -390], [-170, -350]);
  const lnM1aR = makeLine([-50, -390], [-90, -350]);
  const lnM1bL = makeLine([50, -390], [90, -350]);
  const lnM1bR = makeLine([210, -390], [170, -350]);
  yield* all(lnM1aL().end(1, 0.15), lnM1aR().end(1, 0.15), lnM1bL().end(1, 0.15), lnM1bR().end(1, 0.15));

  // Merge level 1: [3,5] and [1,8]
  const m1a = makeBox('3  5', -130, -320, GREEN);
  const m1b = makeBox('1  8', 130, -320, GREEN);
  yield* all(m1a().opacity(1, 0.15), m1a().scale(1, 0.25, easeOutBack), m1b().opacity(1, 0.15), m1b().scale(1, 0.25, easeOutBack));

  // Lines M1 → M0
  const lnM0L = makeLine([-130, -290], [-60, -250]);
  const lnM0R = makeLine([130, -290], [60, -250]);
  yield* all(lnM0L().end(1, 0.15), lnM0R().end(1, 0.15));

  // Final merge: [1,3,5,8]
  const final = createRef<Rect>();
  view.add(
    <Rect ref={final} width={300} height={60} radius={14} fill={GREEN} y={-220} opacity={0} scale={0}>
      <Txt text={'1  3  5  8'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={32} fontWeight={900} />
    </Rect>,
  );
  yield* all(final().opacity(1, 0.2), final().scale(1, 0.3, easeOutBack));

  const complexity = createRef<Txt>();
  view.add(<Txt ref={complexity} text={'O(n log n)'} fill={GREEN} fontFamily={CODE_FONT} fontSize={72} fontWeight={900} y={-80} opacity={0} />);
  yield* fadeIn(complexity(), 0.3);

  const desc = createRef<Txt>();
  view.add(<Txt ref={desc} text={'Split in half, sort each,\nmerge back together'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} fontWeight={800} y={60} textAlign={'center'} lineHeight={58} opacity={0} />);
  yield* fadeInUp(desc(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Guaranteed fast! Uses extra space 📦'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={200} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
