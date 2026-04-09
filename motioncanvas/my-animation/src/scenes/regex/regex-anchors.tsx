import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, CODE_FONT, TITLE_FONT, ORANGE, PURPLE, CYAN} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const title = createRef<Txt>(); const subtitle = createRef<Txt>(); const badge = createRef<Rect>(); const cards = createRefArray<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#4'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={50} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'^ $'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={80} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Anchors'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(
    <Rect ref={cards} width={750} height={120} y={-220} radius={16} fill={TERMINAL_BG} stroke={PURPLE} lineWidth={3} opacity={0} scale={0.8}>
      <Txt text={'^hello'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} x={-220} />
      <Txt text={'Starts with hello'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={80} />
    </Rect>
  );
  view.add(
    <Rect ref={cards} width={750} height={120} y={-70} radius={16} fill={TERMINAL_BG} stroke={PURPLE} lineWidth={3} opacity={0} scale={0.8}>
      <Txt text={'world$'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} x={-220} />
      <Txt text={'Ends with world'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={80} />
    </Rect>
  );
  view.add(
    <Rect ref={cards} width={750} height={120} y={80} radius={16} fill={TERMINAL_BG} stroke={ACCENT_COLOR} lineWidth={3} opacity={0} scale={0.8}>
      <Txt text={'\\bword\\b'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} x={-220} />
      <Txt text={'Word boundary'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={80} />
    </Rect>
  );

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4); yield* waitFor(0.2);
  for (let i = 0; i < 3; i++) {
    yield* all(cards[i].opacity(1, 0.25), cards[i].scale(1, 0.35, easeOutCubic));
    yield* waitFor(0.15);
  }
  yield* waitFor(2);
});
