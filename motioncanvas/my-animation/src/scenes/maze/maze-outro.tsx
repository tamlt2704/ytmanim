import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const glow = createRef<Circle>();
  view.add(<Circle ref={glow} size={600} fill={GREEN} opacity={0} y={-300} />);

  const recap = createRef<Txt>();
  view.add(<Txt ref={recap} text={'Maze: Generated & Solved!'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={48} fontWeight={900} y={-500} opacity={0} />);

  const topics = createRef<Txt>();
  view.add(<Txt ref={topics} text={'🏗️ DFS Recursive Backtracking\n🔍 BFS Shortest Path\n📊 DFS vs BFS Compared\n⚡ Both O(V+E) linear time'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={-320} textAlign={'center'} lineHeight={48} opacity={0} />);

  const handle = createRef<Txt>();
  view.add(<Txt ref={handle} text={'@it4life101'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={80} fontWeight={900} y={-80} letterSpacing={4} opacity={0} />);

  const subBtn = createRef<Rect>();
  view.add(
    <Rect ref={subBtn} y={40} width={380} height={75} radius={38} fill={RED} opacity={0} scale={0}>
      <Txt text={'SUBSCRIBE'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={34} fontWeight={900} letterSpacing={4} />
    </Rect>,
  );

  const like = createRef<Txt>();
  const bell = createRef<Txt>();
  view.add(<Txt ref={like} text={'👍'} fontSize={70} x={-100} y={170} opacity={0} />);
  view.add(<Txt ref={bell} text={'🔔'} fontSize={70} x={100} y={170} opacity={0} />);

  const follow = createRef<Txt>();
  view.add(<Txt ref={follow} text={'More algorithms visualized! 🔥'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={36} y={300} opacity={0} />);

  yield* glow().opacity(0.06, 0.2);
  yield* recap().opacity(1, 0.3);
  yield* topics().opacity(1, 0.3);
  yield* waitFor(0.3);
  yield* handle().opacity(1, 0.3);
  yield* all(subBtn().opacity(1, 0.2), subBtn().scale(1, 0.3, easeOutBack));
  yield* all(like().opacity(1, 0.2), bell().opacity(1, 0.2));
  yield* follow().opacity(1, 0.3);

  yield* subBtn().scale(1.08, 0.25, easeOutCubic);
  yield* subBtn().scale(1, 0.25, easeInOutCubic);
  yield* subBtn().scale(1.08, 0.25, easeOutCubic);
  yield* subBtn().scale(1, 0.25, easeInOutCubic);

  yield* waitFor(1.5);
});
