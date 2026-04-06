import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#1'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Vim Modes'} fill={GREEN} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'The 3 Essential Modes'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  const modes = createRefArray<Rect>();
  const modeData = [
    {name: 'NORMAL', key: 'Esc', desc: 'Navigate & command', color: GREEN, y: -200},
    {name: 'INSERT', key: 'i', desc: 'Type text', color: ACCENT_COLOR, y: 0},
    {name: 'VISUAL', key: 'v', desc: 'Select text', color: PURPLE, y: 200},
  ];
  for (const m of modeData) {
    view.add(
      <Rect ref={modes} width={750} height={140} y={m.y} radius={16} fill={TERMINAL_BG} stroke={m.color} lineWidth={3} opacity={0} scale={0.8}>
        <Txt text={m.name} fill={m.color} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} x={-200} />
        <Rect x={200} width={80} height={50} radius={10} fill={m.color}><Txt text={m.key} fill={'#fff'} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} /></Rect>
        <Txt text={m.desc} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={45} x={-200} />
      </Rect>
    );
  }

  view.add(<Txt ref={tip} text={'Press Esc to always go back\nto Normal mode 🧘'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={550} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.3);

  for (let i = 0; i < 3; i++) {
    yield* all(modes[i].opacity(1, 0.3), modes[i].scale(1, 0.4, easeOutCubic));
    yield* waitFor(0.3);
  }
  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
