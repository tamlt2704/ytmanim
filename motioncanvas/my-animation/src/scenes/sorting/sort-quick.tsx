import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#5 Quick Sort'} fill={RED} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Array: [6, 3, 8, 1, 5]  pivot=5 (last)
  // Partition: <5 → [3,1], pivot [5], >5 → [6,8]
  // Result: [1,3,5,6,8]
  const boxW = 80;
  const gap = 16;
  const y0 = -550;
  const startX = -2 * (boxW + gap); // center 5 boxes

  // Create boxes with values
  const vals = [6, 3, 8, 1, 5];
  const boxRefs: Rect[] = [];
  for (let i = 0; i < vals.length; i++) {
    const ref = createRef<Rect>();
    view.add(
      <Rect ref={ref} x={startX + i * (boxW + gap)} y={y0} width={boxW} height={boxW} radius={14} fill={ACCENT_COLOR} opacity={0} scale={0}>
        <Txt text={`${vals[i]}`} fill={'#fff'} fontFamily={CODE_FONT} fontSize={36} fontWeight={900} />
      </Rect>,
    );
    boxRefs.push(ref());
  }
  yield* all(...boxRefs.map(b => all(b.opacity(1, 0.15), b.scale(1, 0.2, easeOutBack))));
  yield* waitFor(0.2);

  // Highlight pivot
  const pivotLabel = createRef<Txt>();
  view.add(<Txt ref={pivotLabel} text={'pivot = 5'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={y0 + 65} opacity={0} />);
  yield* boxRefs[4].fill(ORANGE, 0.2);
  yield* fadeIn(pivotLabel(), 0.2);
  yield* waitFor(0.3);

  // Scan and color: compare each to pivot
  // 6 > 5 → red
  yield* boxRefs[0].fill(RED, 0.2);
  // 3 < 5 → green
  yield* boxRefs[1].fill(GREEN, 0.2);
  // 8 > 5 → red
  yield* boxRefs[2].fill(RED, 0.2);
  // 1 < 5 → green
  yield* boxRefs[3].fill(GREEN, 0.2);
  yield* waitFor(0.3);

  // Labels
  const leftLabel = createRef<Txt>();
  const rightLabel = createRef<Txt>();
  view.add(<Txt ref={leftLabel} text={'< pivot'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={32} fontWeight={900} x={-200} y={-370} opacity={0} />);
  view.add(<Txt ref={rightLabel} text={'> pivot'} fill={RED} fontFamily={TITLE_FONT} fontSize={32} fontWeight={900} x={200} y={-370} opacity={0} />);
  yield* all(fadeIn(leftLabel(), 0.2), fadeIn(rightLabel(), 0.2));

  // Move to partitioned positions: [3, 1] [5] [6, 8]
  const partY = -300;
  // Left group: 3 (box 1), 1 (box 3)
  yield* all(
    boxRefs[1].x(-240, 0.4, easeInOutCubic), boxRefs[1].y(partY, 0.4, easeInOutCubic),
    boxRefs[3].x(-240 + boxW + gap, 0.4, easeInOutCubic), boxRefs[3].y(partY, 0.4, easeInOutCubic),
  );
  // Pivot: 5 (box 4)
  yield* all(
    boxRefs[4].x(0, 0.4, easeInOutCubic), boxRefs[4].y(partY, 0.4, easeInOutCubic),
  );
  // Right group: 6 (box 0), 8 (box 2)
  yield* all(
    boxRefs[0].x(240 - boxW - gap, 0.4, easeInOutCubic), boxRefs[0].y(partY, 0.4, easeInOutCubic),
    boxRefs[2].x(240, 0.4, easeInOutCubic), boxRefs[2].y(partY, 0.4, easeInOutCubic),
  );
  yield* waitFor(0.3);

  // Show final sorted result
  const sorted = [1, 3, 5, 6, 8];
  const resultY = -140;
  const resultRefs = sorted.map((v, i) => {
    const ref = createRef<Rect>();
    view.add(
      <Rect ref={ref} x={startX + i * (boxW + gap)} y={resultY} width={boxW} height={boxW} radius={14} fill={GREEN} opacity={0} scale={0}>
        <Txt text={`${v}`} fill={'#fff'} fontFamily={CODE_FONT} fontSize={36} fontWeight={900} />
      </Rect>,
    );
    return ref;
  });

  const sortedLabel = createRef<Txt>();
  view.add(<Txt ref={sortedLabel} text={'Recurse on each half →'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={-190} opacity={0} />);
  yield* fadeIn(sortedLabel(), 0.2);
  yield* all(...resultRefs.map(r => all(r().opacity(1, 0.15), r().scale(1, 0.25, easeOutBack))));

  const complexity = createRef<Txt>();
  view.add(<Txt ref={complexity} text={'O(n log n) avg'} fill={GREEN} fontFamily={CODE_FONT} fontSize={64} fontWeight={900} y={10} opacity={0} />);
  yield* fadeIn(complexity(), 0.3);

  const desc = createRef<Txt>();
  view.add(<Txt ref={desc} text={'Pick a pivot, partition\naround it, recurse'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} fontWeight={800} y={150} textAlign={'center'} lineHeight={58} opacity={0} />);
  yield* fadeInUp(desc(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Fastest in practice! In-place ⚡'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={290} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
