import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'DFS vs BFS'}
      fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const subtitle = createRef<Txt>();
  view.add(
    <Txt ref={subtitle}
      text={'Two sides of graph traversal'}
      fill={'#8b949e'} fontFamily={CODE_FONT}
      fontSize={32} y={-720} opacity={0}
    />,
  );
  yield* fadeIn(subtitle(), 0.2);

  // DFS column
  const dfsHeader = createRef<Rect>();
  view.add(
    <Rect ref={dfsHeader}
      width={260} height={60} radius={30}
      fill={GREEN + '20'} stroke={GREEN} lineWidth={2}
      x={-160} y={-630} opacity={0} scale={0}
    >
      <Txt text={'DFS'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={36} fontWeight={900} />
    </Rect>,
  );
  yield* all(dfsHeader().opacity(1, 0.2), dfsHeader().scale(1, 0.3, easeOutBack));

  // BFS column
  const bfsHeader = createRef<Rect>();
  view.add(
    <Rect ref={bfsHeader}
      width={260} height={60} radius={30}
      fill={ACCENT_COLOR + '20'} stroke={ACCENT_COLOR} lineWidth={2}
      x={160} y={-630} opacity={0} scale={0}
    >
      <Txt text={'BFS'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={36} fontWeight={900} />
    </Rect>,
  );
  yield* all(bfsHeader().opacity(1, 0.2), bfsHeader().scale(1, 0.3, easeOutBack));

  // Divider
  const divider = createRef<Line>();
  view.add(<Line ref={divider} points={[[0, -590], [0, 350]]} stroke={'#30363d'} lineWidth={2} end={0} />);
  yield* divider().end(1, 0.4, easeOutCubic);

  // Comparison rows
  const rows = [
    {label: 'Data Structure', dfs: 'Stack\n(LIFO)', bfs: 'Queue\n(FIFO)', color: ORANGE},
    {label: 'Explores', dfs: 'Deep first\nthen backtracks', bfs: 'Wide first\nlevel by level', color: PURPLE},
    {label: 'Shortest Path?', dfs: '❌ No\nnot guaranteed', bfs: '✅ Yes\nalways shortest', color: RED},
    {label: 'Memory', dfs: 'O(depth)\nof maze', bfs: 'O(width)\nof maze', color: ACCENT_COLOR},
    {label: 'Time', dfs: 'O(V + E)', bfs: 'O(V + E)', color: GREEN},
    {label: 'Best For', dfs: 'Generating\nmazes', bfs: 'Solving\nmazes', color: ORANGE},
  ];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const y = -530 + i * 145;

    // Label
    const label = createRef<Txt>();
    view.add(<Txt ref={label} text={r.label} fill={r.color} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} y={y} opacity={0} />);
    yield* fadeIn(label(), 0.15);

    // DFS value
    const dfsVal = createRef<Rect>();
    view.add(
      <Rect ref={dfsVal}
        width={230} height={75} radius={12}
        fill={GREEN + '08'}
        x={-160} y={y + 50} opacity={0} scale={0}
      >
        <Txt text={r.dfs} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} textAlign={'center'} lineHeight={28} />
      </Rect>,
    );

    // BFS value
    const bfsVal = createRef<Rect>();
    view.add(
      <Rect ref={bfsVal}
        width={230} height={75} radius={12}
        fill={ACCENT_COLOR + '08'}
        x={160} y={y + 50} opacity={0} scale={0}
      >
        <Txt text={r.bfs} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} textAlign={'center'} lineHeight={28} />
      </Rect>,
    );

    yield* all(
      dfsVal().opacity(1, 0.15), dfsVal().scale(1, 0.25, easeOutBack),
      bfsVal().opacity(1, 0.15), bfsVal().scale(1, 0.25, easeOutBack),
    );
    yield* waitFor(0.4);
  }

  const takeaway = createRef<Txt>();
  view.add(
    <Txt ref={takeaway}
      text={'DFS generates, BFS solves\nPerfect combo! 🤝'}
      fill={GREEN} fontFamily={TITLE_FONT}
      fontSize={36} fontWeight={800}
      y={430} textAlign={'center'} lineHeight={52}
      opacity={0}
    />,
  );
  yield* fadeInUp(takeaway(), 20, 0.3);
  yield* pulse(takeaway() as any, 1.05, 0.3);

  yield* waitFor(2);
});
