import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeOutBack, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG, CYAN} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, showCreate, popIn, pulse, shake, drawLine} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  view.add(<Rect ref={badge} x={0} y={-800} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#7'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Sorites Heap'} fill={GREEN} fontFamily={CODE_FONT} fontSize={85} fontWeight={800} y={-680} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* fadeInUp(title(), 30, 0.3);
  yield* waitFor(0.2);

  const s0 = createRef<Txt>();
  view.add(<Txt ref={s0} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={-350} opacity={0} />);
  const s1 = createRef<Txt>();
  view.add(<Txt ref={s1} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={-270} opacity={0} />);

  const r0 = createRef<Txt>();
  view.add(<Txt ref={r0} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} y={-150} opacity={0} />);
  const r1 = createRef<Txt>();
  view.add(<Txt ref={r1} text={''} fill={ORANGE} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} y={-80} opacity={0} />);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Vague predicates have no sharp boundary\nBald, tall, rich — all sorites problems'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={600} textAlign={'center'} lineHeight={46} opacity={0} />);

  yield* s0().opacity(1, 0.2);
  yield* s0().text('Remove one grain from a heap.', 0.3);
  yield* waitFor(0.3);
  yield* s1().opacity(1, 0.2);
  yield* s1().text('Still a heap. Remove another...', 0.3);
  yield* waitFor(0.3);

  yield* fadeInUp(r0(), 20, 0.3);
  yield* r0().text('When does it stop being a heap?', 0.3);
  yield* pulse(r0() as any, 1.15, 0.3);
  yield* fadeInUp(r1(), 20, 0.3);
  yield* r1().text('1 grain? 10? 100?', 0.3);

  yield* fadeIn(tip(), 0.4);
  yield* waitFor(1.5);
});
