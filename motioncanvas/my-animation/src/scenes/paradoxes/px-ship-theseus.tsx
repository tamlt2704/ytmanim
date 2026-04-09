import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeOutBack, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG, CYAN} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, showCreate, popIn, pulse, shake, drawLine} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  // SPLASH visible from frame 0
  view.add(<Circle x={-200} y={-400} size={800} fill={PURPLE} opacity={0.06} />);
  view.add(<Circle x={300} y={400} size={600} fill={RED} opacity={0.05} />);
  view.add(<Rect x={0} y={-958} width={1080} height={4} fill={PURPLE} opacity={0.5} />);
  view.add(<Rect x={0} y={958} width={1080} height={4} fill={RED} opacity={0.5} />);
  view.add(<Rect x={-490} y={-910} width={200} height={200} rotation={45} fill={PURPLE} opacity={0.08} radius={16} />);
  view.add(<Rect x={490} y={910} width={160} height={160} rotation={45} fill={RED} opacity={0.08} radius={16} />);

  const bigNum = createRef<Txt>();
  view.add(<Txt ref={bigNum} text={'8'} fill={PURPLE} fontFamily={TITLE_FONT} fontSize={300} fontWeight={900} y={-500} opacity={0.85} letterSpacing={10} />);
  const splTopic = createRef<Txt>();
  view.add(<Txt ref={splTopic} text={'PARADOXES'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={900} y={-250} opacity={1} letterSpacing={8} />);
  const splSub = createRef<Txt>();
  view.add(<Txt ref={splSub} text={'VISUALIZED'} fill={PURPLE} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-140} opacity={1} />);
  const splLine = createRef<Txt>();
  view.add(<Txt ref={splLine} text={'Mind-Bending Logic'} fill={'#8b949e'} fontFamily={TITLE_FONT} fontSize={48} fontWeight={700} y={-40} opacity={1} />);
  const splBadge = createRef<Rect>();
  view.add(<Rect ref={splBadge} y={50} width={280} height={56} radius={28} fill={PURPLE} opacity={1}><Txt text={'60 SECONDS'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} /></Rect>);

  // Decorative symbols
  const syms = ['\u221e', '\u00bf', '\u2205', '\u2234', '\u2261', '\u00ac'];
  const symC = [PURPLE, RED, ORANGE, GREEN, ACCENT_COLOR, CYAN];
  for (let i = 0; i < 6; i++) {
    view.add(<Txt text={syms[i]} fill={symC[i]} fontFamily={CODE_FONT} fontSize={50} opacity={0.15} x={-300 + i * 120} y={250} />);
  }

  yield* waitFor(1.5);
  yield* all(
    bigNum().opacity(0, 0.4), splTopic().opacity(0, 0.4),
    splSub().opacity(0, 0.4), splLine().opacity(0, 0.3), splBadge().opacity(0, 0.3),
  );

  const badge = createRef<Rect>();
  view.add(<Rect ref={badge} x={0} y={-800} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#1'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Ship of Theseus'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={85} fontWeight={800} y={-680} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* fadeInUp(title(), 30, 0.3);
  yield* waitFor(0.2);

  const s0 = createRef<Txt>();
  view.add(<Txt ref={s0} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={-350} opacity={0} />);
  const s1 = createRef<Txt>();
  view.add(<Txt ref={s1} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={-270} opacity={0} />);

  const r0 = createRef<Txt>();
  view.add(<Txt ref={r0} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} y={-150} opacity={0} />);
  const r1 = createRef<Txt>();
  view.add(<Txt ref={r1} text={''} fill={ORANGE} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-80} opacity={0} />);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Identity is not in the parts\nbut in the pattern'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={600} textAlign={'center'} lineHeight={46} opacity={0} />);

  yield* s0().opacity(1, 0.2);
  yield* s0().text('A ship has every plank replaced', 0.3);
  yield* waitFor(0.3);
  yield* s1().opacity(1, 0.2);
  yield* s1().text('one by one over the years.', 0.3);
  yield* waitFor(0.3);

  yield* fadeInUp(r0(), 20, 0.3);
  yield* r0().text('Is it still the same ship?', 0.3);
  yield* pulse(r0() as any, 1.15, 0.3);
  yield* fadeInUp(r1(), 20, 0.3);
  yield* r1().text('What if you rebuild the old planks?', 0.3);

  yield* fadeIn(tip(), 0.4);
  yield* waitFor(1.5);
});
