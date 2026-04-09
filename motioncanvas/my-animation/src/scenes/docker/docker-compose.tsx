import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const lines = createRefArray<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#10'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={50} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'compose up'} fill={GREEN} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Multi-Container Apps'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  view.add(
    <Rect ref={terminal} width={900} height={400} y={-130} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-175} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'Terminal'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={lines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} x={-410} y={-100} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-45} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={0} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={45} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Service boxes
  const services = createRefArray<Rect>();
  const svcData = [
    {name: 'web', emoji: '🌐', color: ACCENT_COLOR, x: -280},
    {name: 'api', emoji: '⚡', color: GREEN, x: 0},
    {name: 'db', emoji: '🗄️', color: ORANGE, x: 280},
  ];
  for (const s of svcData) {
    view.add(
      <Rect ref={services} x={s.x} y={380} width={200} height={120} radius={14} fill={s.color} opacity={0} scale={0}>
        <Txt text={s.emoji} fontSize={40} y={-18} />
        <Txt text={s.name} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} y={28} />
      </Rect>
    );
  }

  view.add(<Txt ref={tip} text={'Define your entire stack\nin one YAML file 🎯'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={560} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));
  yield* lines[0].opacity(1, 0.2);
  const cmd = '$ docker compose up -d';
  for (let i = 0; i <= cmd.length; i++) { lines[0].text(cmd.slice(0, i) + '▌'); yield* waitFor(0.04); }
  lines[0].text(cmd);
  yield* waitFor(0.3);

  yield* all(lines[1].opacity(1, 0.3), lines[1].text('✔ Container web    Started', 0.4));
  yield* all(lines[2].opacity(1, 0.3), lines[2].text('✔ Container api    Started', 0.4));
  yield* all(lines[3].opacity(1, 0.3), lines[3].text('✔ Container db     Started', 0.4));
  yield* waitFor(0.3);

  for (let i = 0; i < 3; i++) {
    yield* all(services[i].opacity(1, 0.2), services[i].scale(1, 0.3, easeOutCubic));
  }

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
