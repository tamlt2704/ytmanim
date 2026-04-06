import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, CODE_FONT, TITLE_FONT, ORANGE, PURPLE, CYAN} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const badge = createRef<Rect>(); const title = createRef<Txt>(); const subtitle = createRef<Txt>();
  const codeBox = createRef<Rect>(); const desc = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#7'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={50} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'404'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={140} fontWeight={800} y={-500} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Not Found'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={52} y={-380} opacity={0} />);

  view.add(
    <Rect ref={codeBox} width={700} height={350} y={50} radius={24} fill={TERMINAL_BG} stroke={ORANGE} lineWidth={4} opacity={0} scale={0.8}>
      <Txt text={'🔍'} fontSize={100} y={-60} />
      <Txt text={'The resource does not\nexist at this URL.'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={60} textAlign={'center'} lineHeight={44} />
    </Rect>
  );

  view.add(<Txt ref={desc} text={''} fill={ORANGE} fontFamily={CODE_FONT} fontSize={30} y={400} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-500, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4); yield* waitFor(0.2);
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* waitFor(2);
});
