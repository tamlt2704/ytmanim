import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Solving'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={68} fontWeight={900} y={-850} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'BFS Finding Shortest Path'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={-780} opacity={0} />);
  yield* fadeIn(subtitle(), 0.2);

  // Legend
  const legendY = -710;
  const legendItems = [
    {label: 'Wall', color: '#21262d'},
    {label: 'Explored', color: ACCENT_COLOR + '40'},
    {label: 'Path', color: GREEN},
    {label: 'Start', color: GREEN},
    {label: 'End', color: RED},
  ];
  for (let i = 0; i < legendItems.length; i++) {
    const l = legendItems[i];
    const x = -320 + i * 140;
    if (l.label === 'Start' || l.label === 'End') {
      view.add(<Circle x={x} y={legendY} size={18} fill={l.color} />);
    } else {
      view.add(<Rect x={x} y={legendY} width={18} height={18} radius={3} fill={l.color} />);
    }
    view.add(<Txt text={l.label} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} x={x + 45} y={legendY} />);
  }

  // Rebuild same maze (seed=42, GRID=17)
  const GRID = 17;
  const cellSize = 38;
  const ox = 0;
  const oy = -230;
  const left = ox - (GRID * cellSize) / 2;
  const top = oy - (GRID * cellSize) / 2;

  const grid: number[] = new Array(GRID * GRID).fill(0);
  const idx = (r: number, c: number) => r * GRID + c;

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

  const dirs4 = [[0, 2], [2, 0], [0, -2], [-2, 0]];
  const genStack: [number, number][] = [[1, 1]];
  grid[idx(1, 1)] = 1;
  while (genStack.length > 0) {
    const [cr, cc] = genStack[genStack.length - 1];
    const neighbors: [number, number, number, number][] = [];
    for (const [dr, dc] of seededShuffle(dirs4)) {
      const nr = cr + dr, nc = cc + dc;
      if (nr > 0 && nr < GRID - 1 && nc > 0 && nc < GRID - 1 && grid[idx(nr, nc)] === 0) {
        neighbors.push([nr, nc, cr + dr / 2, cc + dc / 2]);
      }
    }
    if (neighbors.length > 0) {
      const [nr, nc, wr, wc] = neighbors[0];
      grid[idx(wr, wc)] = 1;
      grid[idx(nr, nc)] = 1;
      genStack.push([nr, nc]);
    } else {
      genStack.pop();
    }
  }

  // Draw maze
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
          fill={grid[idx(r, c)] ? BG_COLOR : '#21262d'}
        />,
      );
      cellRefs.push(ref());
    }
  }

  const startR = 1, startC = 1;
  const endR = GRID - 2, endC = GRID - 2;

  // Start/End markers
  yield* all(
    cellRefs[idx(startR, startC)].fill(GREEN, 0.2),
    cellRefs[idx(endR, endC)].fill(RED, 0.2),
  );
  view.add(<Txt text={'S'} fill={BG_COLOR} fontFamily={CODE_FONT} fontSize={20} fontWeight={900} x={left + startC * cellSize + cellSize / 2} y={top + startR * cellSize + cellSize / 2} />);
  view.add(<Txt text={'E'} fill={BG_COLOR} fontFamily={CODE_FONT} fontSize={20} fontWeight={900} x={left + endC * cellSize + cellSize / 2} y={top + endR * cellSize + cellSize / 2} />);

  // Counters
  const queueLabel = createRef<Txt>();
  view.add(<Txt ref={queueLabel} text={'Queue: 1'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} x={-280} y={310} opacity={0} />);
  const exploredLabel = createRef<Txt>();
  view.add(<Txt ref={exploredLabel} text={'Explored: 0'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} x={280} y={310} opacity={0} />);
  yield* all(queueLabel().opacity(1, 0.2), exploredLabel().opacity(1, 0.2));

  yield* waitFor(0.5);

  // BFS
  const bfsDirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue: [number, number][] = [[startR, startC]];
  visited.add(`${startR},${startC}`);
  let found = false;
  let exploredCount = 0;

  while (queue.length > 0 && !found) {
    const [cr, cc] = queue.shift()!;
    exploredCount++;

    if (!(cr === startR && cc === startC) && !(cr === endR && cc === endC)) {
      yield* cellRefs[idx(cr, cc)].fill(ACCENT_COLOR + '35', 0.025);
    }

    for (const [dr, dc] of bfsDirs) {
      const nr = cr + dr, nc = cc + dc;
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < GRID && nc >= 0 && nc < GRID && grid[idx(nr, nc)] === 1 && !visited.has(key)) {
        visited.add(key);
        parent.set(key, `${cr},${cc}`);
        if (nr === endR && nc === endC) {
          found = true;
          break;
        }
        queue.push([nr, nc]);
      }
    }

    if (exploredCount % 3 === 0) {
      queueLabel().text(`Queue: ${queue.length}`);
      exploredLabel().text(`Explored: ${exploredCount}`);
    }
  }

  queueLabel().text(`Queue: ${queue.length}`);
  exploredLabel().text(`Explored: ${exploredCount}`);

  yield* waitFor(0.5);

  // Trace path
  let pathLen = 0;
  if (found) {
    const path: [number, number][] = [];
    let cur = `${endR},${endC}`;
    while (cur !== `${startR},${startC}`) {
      const [r, c] = cur.split(',').map(Number);
      path.push([r, c]);
      cur = parent.get(cur)!;
    }
    path.push([startR, startC]);
    path.reverse();
    pathLen = path.length;

    // Animate path tracing
    for (const [r, c] of path) {
      if ((r === startR && c === startC) || (r === endR && c === endC)) continue;
      yield* cellRefs[idx(r, c)].fill(GREEN, 0.05);
    }

    // Pulse the end
    yield* cellRefs[idx(endR, endC)].fill(GREEN, 0.15);
    yield* cellRefs[idx(endR, endC)].fill(RED, 0.15);
  }

  yield* waitFor(0.3);

  // Stats card
  const statsCard = createRef<Rect>();
  view.add(
    <Rect ref={statsCard}
      width={560} height={200} radius={18}
      fill={ACCENT_COLOR + '10'} stroke={ACCENT_COLOR} lineWidth={2}
      y={440} opacity={0} scale={0}
    >
      <Txt text={'Shortest Path Found! ✅'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={34} fontWeight={900} y={-60} />
      <Txt text={`Path length: ${pathLen} cells`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-15} />
      <Txt text={`Cells explored: ${exploredCount}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={20} />
      <Txt text={'BFS always finds the shortest!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={55} />
    </Rect>,
  );
  yield* all(statsCard().opacity(1, 0.2), statsCard().scale(1, 0.3, easeOutBack));

  yield* waitFor(2.5);
});
