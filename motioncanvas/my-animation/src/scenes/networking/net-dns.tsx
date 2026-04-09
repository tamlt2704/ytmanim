import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, CODE_FONT, TITLE_FONT, ORANGE, PURPLE, CYAN} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const badge = createRef<Rect>(); const title = createRef<Txt>(); const sub = createRef<Txt>();
  const card = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#3'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={50} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'DNS'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-500} opacity={0} />);
  view.add(<Txt ref={sub} text={'Domain Name System'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-390} opacity={0} />);

  view.add(
    <Rect ref={card} width={750} height={400} y={50} radius={24} fill={TERMINAL_BG} stroke={ORANGE} lineWidth={4} opacity={0} scale={0.8}>
      <Txt text={'📖'} fontSize={120} y={-80} />
      <Txt text={'Translates names to IPs'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={50} textAlign={'center'} lineHeight={48} />
      <Txt text={'google.com → 142.250.80.46'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={130} textAlign={'center'} />
    </Rect>
  );

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-500, 0.5, easeOutCubic));
  yield* sub().opacity(1, 0.4); yield* waitFor(0.2);
  yield* all(card().opacity(1, 0.4), card().scale(1, 0.5, easeOutCubic));
  yield* waitFor(2);
});
