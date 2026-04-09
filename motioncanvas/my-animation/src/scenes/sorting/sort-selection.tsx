import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#2 Selection Sort'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={68} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Array: [4, 7, 2, 6, 1]
  const arr = [4, 7, 2, 6, 1];
  const n = arr.length;
  const barW = 70;
  const gap = 20;
  const baseY = -300;
  const maxH = 300;
  const startX = -((n - 1) * (barW + gap)) / 2;

  const barRefs: Rect[] = [];
  const barOrder: number[] = arr.map((_, i) => i);

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
    if (a === b) return;
    const barA = getBar(a);
    const barB = getBar(b);
    yield* all(barA.fill(RED, 0.1), barB.fill(RED, 0.1));
    const xA = barA.x();
    const xB = barB.x();
    yield* all(barA.x(xB, 0.25, easeInOutCubic), barB.x(xA, 0.25, easeInOutCubic));
    const tmp = barOrder[a]; barOrder[a] = barOrder[b]; barOrder[b] = tmp;
    const tmpV = arr[a]; arr[a] = arr[b]; arr[b] = tmpV;
  };

  const scanForMin = function* (from: number): Generator<any, number, any> {
    let minIdx = from;
    yield* getBar(from).fill(ORANGE, 0.08);
    for (let k = from + 1; k < n; k++) {
      yield* getBar(k).fill(ORANGE, 0.08);
      if (arr[k] < arr[minIdx]) {
        yield* getBar(minIdx).fill(ACCENT_COLOR, 0.08);
        minIdx = k;
      } else {
        yield* getBar(k).fill(ACCENT_COLOR, 0.08);
      }
    }
    yield* getBar(minIdx).fill(RED, 0.1);
    return minIdx;
  };

  // [4,7,2,6,1] → min=1 at 4, swap(0,4) → [1,7,2,6,4]
  let minIdx = yield* scanForMin(0);
  yield* swapPos(0, minIdx);
  yield* getBar(0).fill(GREEN, 0.15);

  // [1,7,2,6,4] → min=2 at 2, swap(1,2) → [1,2,7,6,4]
  minIdx = yield* scanForMin(1);
  yield* swapPos(1, minIdx);
  yield* getBar(1).fill(GREEN, 0.15);

  // [1,2,7,6,4] → min=4 at 4, swap(2,4) → [1,2,4,6,7]
  minIdx = yield* scanForMin(2);
  yield* swapPos(2, minIdx);
  yield* getBar(2).fill(GREEN, 0.15);

  // [1,2,4,6,7] → min=6 at 3, no swap needed
  minIdx = yield* scanForMin(3);
  yield* swapPos(3, minIdx);
  yield* getBar(3).fill(GREEN, 0.15);

  yield* getBar(4).fill(GREEN, 0.15);

  const complexity = createRef<Txt>();
  view.add(<Txt ref={complexity} text={'O(n²)'} fill={RED} fontFamily={CODE_FONT} fontSize={80} fontWeight={900} y={50} opacity={0} />);
  yield* fadeIn(complexity(), 0.3);

  const desc = createRef<Txt>();
  view.add(<Txt ref={desc} text={'Find the minimum,\nswap it to the front'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={42} fontWeight={800} y={200} textAlign={'center'} lineHeight={60} opacity={0} />);
  yield* fadeInUp(desc(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Fewer swaps than Bubble Sort! 🎯'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={340} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
