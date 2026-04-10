import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Generation'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={68} fontWeight={900} y={-850} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'Recursive Backtracking in Action'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={-780} opacity={0} />);
  yield* fadeIn(subtitle(), 0.2);

  // Legend
  const legendY = -710;
  const legendItems = [
    {label: 'Wall', color: '#21262d'},
    {label: 'Passage', color: BG_COLOR, stroke: '#30363d'},
    {label: 'Current', color: GREEN},
    {label: 'Backtrack', color: ORANGE},
  ];
  for (let i = 0; i < legendItems.length; i++) {
    const l = legendItems[i];
    const x = -280 + i * 155;
    view.add(<Rect x={x} y={legendY} width={22} height={22} radius={4} fill={l.color} stroke={l.stroke || l.color} lineWidth={l.stroke ? 1 : 0} />);
    view.add(<Txt text={l.label} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} x={x + 55} y={legendY} />);
  }

  // Grid setup
  const GRID = 17;
  const cellSize = 38;
  const ox = 0;
  const oy = -230;
  const left = ox - (GRID * cellSize) / 2;
  const top = oy - (GRID * cellSize) / 2;

  const grid: number[] = new Array(GRID * GRID).fill(0);
  const cellRefs: Rect[] = [];

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const ref = createRef<Rect>();
      view.add(
        <Rect
          ref={ref}
          x={left + c * cellSize + cellSize / 2}
          y={top + r * cellSize + cellSize / 2}
          width={cellSize - 2} height={cellSize - 2} radius={3}
          fill={'#21262d'}
        />,
      );
      cellRefs.push(ref());
    }
  }

  // Stack size & step counter
  const stackLabel = createRef<Txt>();
  view.add(<Txt ref={stackLabel} text={'Stack: 0'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} x={-280} y={310} opacity={0} />);
  const stepLabel = createRef<Txt>();
  view.add(<Txt ref={stepLabel} text={'Steps: 0'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} x={280} y={310} opacity={0} />);
  yield* all(stackLabel().opacity(1, 0.2), stepLabel().opacity(1, 0.2));

  yield* waitFor(0.3);

  const idx = (r: number, c: number) => r * GRID + c;
  const carve = function* (r: number, c: number) {
    grid[idx(r, c)] = 1;
    yield* cellRefs[idx(r, c)].fill(BG_COLOR, 0.03);
  };

  // Seeded random for reproducibility
  let seed = 42;
  const seededRandom = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const seededShuffle = <T,>(a: T[]): T[] => {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };

  const dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]];
  const stack: [number, number][] = [];
  const startR = 1, startC = 1;
  yield* carve(startR, startC);
  yield* cellRefs[idx(startR, startC)].fill(GREEN, 0.03);
  stack.push([startR, startC]);

  let steps = 0;
  let maxStack = 0;

  while (stack.length > 0) {
    const [cr, cc] = stack[stack.length - 1];
    const neighbors: [number, number, number, number][] = [];

    for (const [dr, dc] of seededShuffle(dirs)) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (nr > 0 && nr < GRID - 1 && nc > 0 && nc < GRID - 1 && grid[idx(nr, nc)] === 0) {
        neighbors.push([nr, nc, cr + dr / 2, cc + dc / 2]);
      }
    }

    yield* cellRefs[idx(cr, cc)].fill(BG_COLOR, 0.015);

    if (neighbors.length > 0) {
      const [nr, nc, wr, wc] = neighbors[0];
      yield* carve(wr, wc);
      yield* carve(nr, nc);
      yield* cellRefs[idx(nr, nc)].fill(GREEN, 0.015);
      stack.push([nr, nc]);
      if (stack.length > maxStack) maxStack = stack.length;
    } else {
      yield* cellRefs[idx(cr, cc)].fill(ORANGE + '30', 0.015);
      yield* cellRefs[idx(cr, cc)].fill(BG_COLOR, 0.015);
      stack.pop();
      if (stack.length > 0) {
        const [br, bc] = stack[stack.length - 1];
        yield* cellRefs[idx(br, bc)].fill(GREEN, 0.015);
      }
    }

    steps++;
    // Update counters every few steps to avoid too many text updates
    if (steps % 3 === 0) {
      stackLabel().text(`Stack: ${stack.length}`);
      stepLabel().text(`Steps: ${steps}`);
    }
  }

  stackLabel().text(`Stack: 0`);
  stepLabel().text(`Steps: ${steps}`);

  // Mark start and end
  yield* all(
    cellRefs[idx(1, 1)].fill(GREEN, 0.2),
    cellRefs[idx(GRID - 2, GRID - 2)].fill(RED, 0.2),
  );

  // Start/End labels
  view.add(<Txt text={'S'} fill={BG_COLOR} fontFamily={CODE_FONT} fontSize={20} fontWeight={900} x={left + 1 * cellSize + cellSize / 2} y={top + 1 * cellSize + cellSize / 2} />);
  view.add(<Txt text={'E'} fill={BG_COLOR} fontFamily={CODE_FONT} fontSize={20} fontWeight={900} x={left + (GRID - 2) * cellSize + cellSize / 2} y={top + (GRID - 2) * cellSize + cellSize / 2} />);

  yield* waitFor(0.5);

  // Stats
  const statsCard = createRef<Rect>();
  view.add(
    <Rect ref={statsCard}
      width={560} height={180} radius={18}
      fill={GREEN + '10'} stroke={GREEN} lineWidth={2}
      y={450} opacity={0} scale={0}
    >
      <Txt text={'Generation Complete ✅'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={34} fontWeight={900} y={-50} />
      <Txt text={`${steps} steps  •  Max stack: ${maxStack}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={0} />
      <Txt text={`${GRID}×${GRID} grid  •  Perfect maze`} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={35} />
    </Rect>,
  );
  yield* all(statsCard().opacity(1, 0.2), statsCard().scale(1, 0.3, easeOutBack));

  yield* waitFor(2.5);
});
