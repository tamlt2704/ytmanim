import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#2'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={':w :q'} fill={GREEN} fontFamily={CODE_FONT} fontSize={110} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Save & Quit'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  const cmds = createRefArray<Rect>();
  const cmdData = [
    {cmd: ':w', desc: 'Save (write)', color: GREEN, y: -220},
    {cmd: ':q', desc: 'Quit', color: ORANGE, y: -70},
    {cmd: ':wq', desc: 'Save & quit', color: ACCENT_COLOR, y: 80},
    {cmd: ':q!', desc: 'Force quit (no save)', color: RED, y: 230},
  ];
  for (const c of cmdData) {
    view.add(
      <Rect ref={cmds} width={750} height={120} y={c.y} radius={16} fill={TERMINAL_BG} stroke={c.color} lineWidth={3} opacity={0} scale={0.8}>
        <Txt text={c.cmd} fill={c.color} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={-220} />
        <Txt text={c.desc} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={100} />
      </Rect>
    );
  }

  view.add(<Txt ref={tip} text={'ZZ also saves & quits\n(no colon needed!) 💡'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={550} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.3);

  for (let i = 0; i < 4; i++) {
    yield* all(cmds[i].opacity(1, 0.3), cmds[i].scale(1, 0.4, easeOutCubic));
    yield* waitFor(0.2);
  }
  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
