import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#4'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'dd'} fill={RED} fontFamily={CODE_FONT} fontSize={120} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Delete Lines'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  const cmds = createRefArray<Rect>();
  const cmdData = [
    {cmd: 'dd', desc: 'Delete current line', color: RED, y: -220},
    {cmd: '5dd', desc: 'Delete 5 lines', color: RED, y: -70},
    {cmd: 'dw', desc: 'Delete word', color: ORANGE, y: 80},
    {cmd: 'D', desc: 'Delete to end of line', color: ORANGE, y: 230},
  ];
  for (const c of cmdData) {
    view.add(
      <Rect ref={cmds} width={750} height={120} y={c.y} radius={16} fill={TERMINAL_BG} stroke={c.color} lineWidth={3} opacity={0} scale={0.8}>
        <Txt text={c.cmd} fill={c.color} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={-220} />
        <Txt text={c.desc} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={100} />
      </Rect>
    );
  }

  view.add(<Txt ref={tip} text={'Deleted text goes to register —\npaste it back with p 📋'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={550} textAlign={'center'} lineHeight={50} opacity={0} />);

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
