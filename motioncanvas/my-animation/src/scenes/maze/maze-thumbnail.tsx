import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={700} fill={GREEN} opacity={0.05} y={-200} />);
  view.add(<Circle size={400} fill={PURPLE} opacity={0.06} x={300} y={600} />);
  view.add(<Rect width={300} height={300} x={-390} y={-810} rotation={45} fill={ACCENT_COLOR} opacity={0.15} />);
  view.add(<Rect width={200} height={200} x={390} y={810} rotation={45} fill={GREEN} opacity={0.15} />);

  // Mini maze grid
  const cell = 34;
  const cols = 13;
  const rows = 13;
  const ox = 0;
  const oy = -430;
  const left = ox - (cols * cell) / 2;
  const top = oy - (rows * cell) / 2;

  const maze = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,1,0,0,0,1,0,0,0,1,
    1,0,1,0,1,0,1,0,1,0,1,0,1,
    1,0,1,0,0,0,1,0,0,0,1,0,1,
    1,0,1,1,1,0,1,1,1,0,1,0,1,
    1,0,0,0,0,0,0,0,1,0,0,0,1,
    1,1,1,0,1,1,1,0,1,1,1,0,1,
    1,0,0,0,1,0,0,0,0,0,1,0,1,
    1,0,1,1,1,0,1,1,1,0,1,0,1,
    1,0,0,0,0,0,1,0,0,0,0,0,1,
    1,0,1,1,1,1,1,0,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,
  ];

  // Solution path
  const solution: [number,number][] = [
    [1,1],[1,2],[1,3],[2,3],[3,3],[3,4],[3,5],[4,5],[5,5],[5,6],[5,7],
    [6,7],[7,7],[7,8],[7,9],[8,9],[9,9],[9,10],[9,11],[10,11],[11,11],
  ];
  // BFS explored cells (not on solution)
  const explored: [number,number][] = [
    [2,1],[3,1],[4,1],[5,1],[5,2],[5,3],[5,4],[1,5],[1,6],[1,7],
    [7,1],[7,2],[7,3],[9,1],[9,2],[9,3],[9,4],[9,5],[11,1],[11,2],
    [11,3],[11,4],[11,5],[11,6],[11,7],[11,8],[11,9],[11,10],
  ];
  const solSet = new Set(solution.map(([r,c]) => `${r},${c}`));
  const expSet = new Set(explored.map(([r,c]) => `${r},${c}`));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isWall = maze[r * cols + c];
      const isSol = solSet.has(`${r},${c}`);
      const isExp = expSet.has(`${r},${c}`);
      const x = left + c * cell + cell / 2;
      const y = top + r * cell + cell / 2;
      view.add(
        <Rect
          x={x} y={y}
          width={cell - 2} height={cell - 2} radius={4}
          fill={isWall ? '#21262d' : isSol ? GREEN + '50' : isExp ? ACCENT_COLOR + '25' : BG_COLOR}
        />,
      );
    }
  }

  // Start & end markers
  const sr = 1, sc = 1, er = 11, ec = 11;
  view.add(<Circle x={left + sc * cell + cell / 2} y={top + sr * cell + cell / 2} size={cell - 8} fill={GREEN} />);
  view.add(<Circle x={left + ec * cell + cell / 2} y={top + er * cell + cell / 2} size={cell - 8} fill={RED} />);
  view.add(<Txt text={'S'} fill={BG_COLOR} fontFamily={CODE_FONT} fontSize={18} fontWeight={900} x={left + sc * cell + cell / 2} y={top + sr * cell + cell / 2} />);
  view.add(<Txt text={'E'} fill={BG_COLOR} fontFamily={CODE_FONT} fontSize={18} fontWeight={900} x={left + ec * cell + cell / 2} y={top + er * cell + cell / 2} />);

  view.add(<Txt text={'MAZE'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={130} fontWeight={900} y={-20} />);
  view.add(<Txt text={'GENERATOR'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={100} fontWeight={900} y={110} letterSpacing={6} />);
  view.add(<Txt text={'& SOLVER'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={100} fontWeight={900} y={230} />);
  view.add(<Txt text={'Watch the algorithm think'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={350} />);

  // Legend
  view.add(<Circle x={-180} y={440} size={20} fill={GREEN} />);
  view.add(<Txt text={'Start'} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} x={-120} y={440} />);
  view.add(<Circle x={0} y={440} size={20} fill={RED} />);
  view.add(<Txt text={'End'} fill={RED} fontFamily={CODE_FONT} fontSize={24} x={45} y={440} />);
  view.add(<Rect x={120} y={440} width={20} height={20} radius={4} fill={ACCENT_COLOR + '40'} />);
  view.add(<Txt text={'BFS'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={24} x={165} y={440} />);

  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'2m'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );

  yield* waitFor(3);
});
