import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const title = createRef<Txt>(); const subtitle = createRef<Txt>(); const terminal = createRef<Rect>(); const lines = createRefArray<Txt>(); const badge = createRef<Rect>(); const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#5'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'HAVING'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Filter Groups'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  view.add(
    <Rect ref={terminal} width={900} height={500} y={-100} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-225} fill={'#21262d'}><Circle size={16} fill={RED} x={-400} /><Circle size={16} fill={ORANGE} x={-370} /><Circle size={16} fill={GREEN} x={-340} /><Txt text={'SQL'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={lines} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={24} x={-410} y={-140} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={24} x={-410} y={-90} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={24} x={-410} y={-40} offsetX={-1} opacity={0} />
    </Rect>
  );
  view.add(<Txt ref={tip} text={'\n'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={550} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4); yield* waitFor(0.2);
  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));
  yield* all(lines[0].opacity(1, 0.3), lines[0].text('SELECT dept, AVG(salary) avg|FROM employees GROUP BY dept|HAVING AVG(salary) > 80000;', 0.4));
  yield* all(lines[1].opacity(1, 0.3), lines[1].text('WHERE filters rows\nHAVING filters groups 🎯', 0.4));
  yield* all(lines[2].opacity(1, 0.3), lines[2].text('Use HAVING after GROUP BY', 0.4));
  yield* tip().opacity(1, 0.5); yield* waitFor(2);
});
