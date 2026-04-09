import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#3 Insertion Sort'} fill={GREEN} fontFamily={CODE_FONT} fontSize={68} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Array: [5, 3, 8, 1, 4]
  const arr = [5, 3, 8, 1, 4];
  const n = arr.length;
  const barW = 70;
  const gap = 20;
  const baseY = -300;
  const maxH = 300;
  const startX = -((n - 1) * (barW + gap)) / 2;
  const xAt = (pos: number) => startX + pos * (barW + gap);

  const barRefs: Rect[] = [];
  const barOrder: number[] = arr.map((_, i) => i);

  for (let i = 0; i < n; i++) {
    const h = (arr[i] / 8) * maxH;
    const ref = createRef<Rect>();
    view.add(
      <Rect ref={ref} x={xAt(i)} y={baseY - h / 2} width={barW} height={h} radius={10} fill={ACCENT_COLOR} opacity={0}>
        <Txt text={`${arr[i]}`} fill={'#fff'} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} />
      </Rect>,
    );
    barRefs.push(ref());
  }
  yield* all(...barRefs.map(b => b.opacity(1, 0.2)));
  yield* barRefs[barOrder[0]].fill(GREEN, 0.15);
  yield* waitFor(0.3);

  const getBar = (pos: number) => barRefs[barOrder[pos]];

  // Insertion sort: for each element, shift it left until it's in place
  const insertAt = function* (fromPos: number) {
    const bar = getBar(fromPos);
    const liftY = bar.y() - 80;
    yield* bar.fill(ORANGE, 0.1);
    yield* bar.y(liftY, 0.15, easeInOutCubic);

    let j = fromPos;
    while (j > 0 && arr[j - 1] > arr[j]) {
      // Shift arr[j-1] right visually
      const shiftBar = getBar(j - 1);
      yield* shiftBar.x(xAt(j), 0.15, easeInOutCubic);

      // Update tracking
      const tmpO = barOrder[j]; barOrder[j] = barOrder[j - 1]; barOrder[j - 1] = tmpO;
      const tmpV = arr[j]; arr[j] = arr[j - 1]; arr[j - 1] = tmpV;
      j--;
    }

    // Drop into final position
    yield* all(
      bar.x(xAt(j), 0.15, easeInOutCubic),
      bar.y(liftY + 80, 0.15, easeInOutCubic),
    );
    yield* bar.fill(GREEN, 0.1);
  };

  // [5,3,8,1,4] — insert index 1 (val 3): 3<5, shift 5 right → [3,5,8,1,4]
  yield* insertAt(1);

  // [3,5,8,1,4] — insert index 2 (val 8): 8>5, stays → [3,5,8,1,4]
  yield* getBar(2).fill(ORANGE, 0.1);
  yield* getBar(2).fill(GREEN, 0.15);

  // [3,5,8,1,4] — insert index 3 (val 1): 1<8, 1<5, 1<3 → [1,3,5,8,4]
  yield* insertAt(3);

  // [1,3,5,8,4] — insert index 4 (val 4): 4<8, 4<5, 4>3 → [1,3,4,5,8]
  yield* insertAt(4);

  yield* all(...Array.from({length: n}, (_, i) => getBar(i).fill(GREEN, 0.15)));

  const complexity = createRef<Txt>();
  view.add(<Txt ref={complexity} text={'O(n²)  best: O(n)'} fill={RED} fontFamily={CODE_FONT} fontSize={56} fontWeight={900} y={50} opacity={0} />);
  yield* fadeIn(complexity(), 0.3);

  const desc = createRef<Txt>();
  view.add(<Txt ref={desc} text={'Pick each card and slide\nit into the right spot'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={42} fontWeight={800} y={200} textAlign={'center'} lineHeight={60} opacity={0} />);
  yield* fadeInUp(desc(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Great for nearly-sorted data! 🃏'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={340} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
