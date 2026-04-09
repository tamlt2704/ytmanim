import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#1 Bubble Sort'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Array: [5, 2, 8, 1, 4]
  const arr = [5, 2, 8, 1, 4];
  const n = arr.length;
  const barW = 70;
  const gap = 20;
  const baseY = -300;
  const maxH = 300;
  const startX = -((n - 1) * (barW + gap)) / 2;

  // Track bar refs and their logical positions
  const barRefs: Rect[] = [];
  const barOrder: number[] = arr.map((_, i) => i); // barOrder[logicalPos] = refIndex

  for (let i = 0; i < n; i++) {
    const h = (arr[i] / 8) * maxH;
    const ref = createRef<Rect>();
    view.add(
      <Rect ref={ref} x={startX + i * (barW + gap)} y={baseY - h / 2} width={barW} height={h} radius={10} fill={ACCENT_COLOR} opacity={0}>
        <Txt text={`${arr[i]}`} fill={'#fff'} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} />
      </Rect>,
    );
    barRefs.push(ref());
  }
  yield* all(...barRefs.map(b => b.opacity(1, 0.2)));
  yield* waitFor(0.3);

  const getBar = (pos: number) => barRefs[barOrder[pos]];
  const swapPos = function* (a: number, b: number) {
    const barA = getBar(a);
    const barB = getBar(b);
    yield* all(barA.fill(RED, 0.1), barB.fill(RED, 0.1));
    const xA = barA.x();
    const xB = barB.x();
    yield* all(barA.x(xB, 0.25, easeInOutCubic), barB.x(xA, 0.25, easeInOutCubic));
    // Swap in tracking array
    const tmp = barOrder[a];
    barOrder[a] = barOrder[b];
    barOrder[b] = tmp;
    // Swap in arr
    const tmpV = arr[a];
    arr[a] = arr[b];
    arr[b] = tmpV;
    yield* all(barA.fill(ACCENT_COLOR, 0.1), barB.fill(ACCENT_COLOR, 0.1));
  };

  const noSwap = function* (a: number, b: number) {
    const barA = getBar(a);
    const barB = getBar(b);
    yield* all(barA.fill(GREEN, 0.08), barB.fill(GREEN, 0.08));
    yield* all(barA.fill(ACCENT_COLOR, 0.08), barB.fill(ACCENT_COLOR, 0.08));
  };

  // Full bubble sort
  // [5,2,8,1,4]
  // Pass 1: compare 0-1, 1-2, 2-3, 3-4
  yield* swapPos(0, 1);  // 5>2 → [2,5,8,1,4]
  yield* noSwap(1, 2);   // 5<8
  yield* swapPos(2, 3);  // 8>1 → [2,5,1,8,4]
  yield* swapPos(3, 4);  // 8>4 → [2,5,1,4,8]
  yield* getBar(4).fill(GREEN, 0.15);

  // Pass 2: compare 0-1, 1-2, 2-3
  yield* noSwap(0, 1);   // 2<5
  yield* swapPos(1, 2);  // 5>1 → [2,1,5,4,8]
  yield* swapPos(2, 3);  // 5>4 → [2,1,4,5,8]
  yield* getBar(3).fill(GREEN, 0.15);

  // Pass 3: compare 0-1, 1-2
  yield* swapPos(0, 1);  // 2>1 → [1,2,4,5,8]
  yield* noSwap(1, 2);   // 2<4
  yield* getBar(2).fill(GREEN, 0.15);

  // Remaining are sorted
  yield* all(getBar(0).fill(GREEN, 0.15), getBar(1).fill(GREEN, 0.15));

  // Info
  const complexity = createRef<Txt>();
  view.add(<Txt ref={complexity} text={'O(n²)'} fill={RED} fontFamily={CODE_FONT} fontSize={80} fontWeight={900} y={50} opacity={0} />);
  yield* fadeIn(complexity(), 0.3);

  const desc = createRef<Txt>();
  view.add(<Txt ref={desc} text={'Compares adjacent pairs\nand swaps — simple but slow'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} fontWeight={800} y={200} textAlign={'center'} lineHeight={58} opacity={0} />);
  yield* fadeInUp(desc(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Largest "bubbles up" each pass 🫧'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={340} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
