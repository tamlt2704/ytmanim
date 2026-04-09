import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const lines = createRefArray<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#1'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'docker run'} fill={GREEN} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Run a Container'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  view.add(
    <Rect ref={terminal} width={900} height={500} y={-100} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-225} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'Terminal'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={lines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={32} x={-410} y={-130} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} x={-410} y={-60} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} x={-410} y={0} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Container box visualization
  const container = createRef<Rect>();
  view.add(
    <Rect ref={container} y={350} width={250} height={150} radius={16} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'🐳'} fontSize={50} y={-20} />
      <Txt text={'nginx:latest'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} y={40} />
    </Rect>
  );

  view.add(<Txt ref={tip} text={'Pulls image & starts a container\nin one command ✨'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={550} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));
  yield* lines[0].opacity(1, 0.2);
  const cmd = '$ docker run -d -p 80:80 nginx';
  for (let i = 0; i <= cmd.length; i++) { lines[0].text(cmd.slice(0, i) + '▌'); yield* waitFor(0.04); }
  lines[0].text(cmd);
  yield* waitFor(0.3);

  yield* all(lines[1].opacity(1, 0.3), lines[1].text('Container started: a3f8b2c...', 0.5));
  yield* all(lines[2].opacity(1, 0.3), lines[2].text('Listening on port 80', 0.4));
  yield* waitFor(0.3);

  yield* all(container().opacity(1, 0.3), container().scale(1, 0.5, easeOutCubic));
  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
