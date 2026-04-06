import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const lines = createRefArray<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#5'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'docker logs'} fill={GREEN} fontFamily={CODE_FONT} fontSize={95} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'View Container Output'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  view.add(
    <Rect ref={terminal} width={900} height={500} y={-100} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-225} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'Terminal'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={lines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={-140} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-80} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-35} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={10} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={55} offsetX={-1} opacity={0} />
    </Rect>
  );

  view.add(<Txt ref={tip} text={'Use -f to follow logs in real-time\nlike tail -f 📡'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={550} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));
  yield* lines[0].opacity(1, 0.2);
  const cmd = '$ docker logs -f nginx';
  for (let i = 0; i <= cmd.length; i++) { lines[0].text(cmd.slice(0, i) + '▌'); yield* waitFor(0.04); }
  lines[0].text(cmd);
  yield* waitFor(0.3);

  yield* all(lines[1].opacity(1, 0.3), lines[1].text('2024-01-15 10:23:01 [notice] start', 0.4));
  yield* all(lines[2].opacity(1, 0.3), lines[2].text('GET /api/users 200 12ms', 0.4));
  yield* all(lines[3].opacity(1, 0.3), lines[3].text('POST /api/login 401 8ms', 0.4));
  yield* all(lines[4].opacity(1, 0.3), lines[4].text('GET /api/health 200 2ms', 0.4));
  yield* waitFor(0.3);

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
