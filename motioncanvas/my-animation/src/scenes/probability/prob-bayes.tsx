import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, showCreate, typeText, popIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  // Title
  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={"Bayes' Theorem"} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Update Beliefs with Evidence'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);
  yield* waitFor(0.2);

  // Formula
  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={56} fontWeight={800} y={-580} opacity={0} />);
  yield* formula().opacity(1, 0.2);
  yield* typeText(formula(), 'P(A|B) = P(B|A)\u00b7P(A) / P(B)', 0.04);
  yield* waitFor(0.4);

  // Visual: two overlapping circles (Venn diagram)
  const vennA = createRef<Circle>();
  const vennB = createRef<Circle>();
  const overlap = createRef<Rect>();

  view.add(<Circle ref={vennA} x={-100} y={-280} size={320} fill={ACCENT_COLOR} opacity={0} />);
  view.add(<Circle ref={vennB} x={100} y={-280} size={320} fill={ORANGE} opacity={0} />);

  // Labels
  const labelA = createRef<Txt>();
  const labelB = createRef<Txt>();
  const labelAB = createRef<Txt>();
  view.add(<Txt ref={labelA} text={'A'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} x={-200} y={-280} opacity={0} />);
  view.add(<Txt ref={labelB} text={'B'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} x={200} y={-280} opacity={0} />);
  view.add(<Txt ref={labelAB} text={'A\u2229B'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} x={0} y={-280} opacity={0} />);

  yield* all(vennA().opacity(0.4, 0.4), vennB().opacity(0.4, 0.4));
  yield* all(labelA().opacity(1, 0.3), labelB().opacity(1, 0.3));
  yield* waitFor(0.2);
  yield* labelAB().opacity(1, 0.3);
  yield* waitFor(0.3);

  // Example
  const ex1 = createRef<Txt>();
  const ex2 = createRef<Txt>();
  const ex3 = createRef<Txt>();
  const ex4 = createRef<Txt>();
  view.add(<Txt ref={ex1} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} y={-80} opacity={0} />);
  view.add(<Txt ref={ex2} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-20} opacity={0} />);
  view.add(<Txt ref={ex3} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={40} opacity={0} />);
  view.add(<Txt ref={ex4} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={120} opacity={0} />);

  yield* ex1().opacity(1, 0.2);
  yield* typeText(ex1(), 'Disease test: 99% accurate', 0.04);
  yield* waitFor(0.2);

  yield* ex2().opacity(1, 0.2);
  yield* typeText(ex2(), '1% of population has disease', 0.04);
  yield* waitFor(0.2);

  yield* ex3().opacity(1, 0.2);
  yield* typeText(ex3(), 'You test positive. Chance you have it?', 0.04);
  yield* waitFor(0.3);

  yield* ex4().opacity(1, 0.2);
  yield* typeText(ex4(), 'Only ~50%! Not 99%', 0.04);
  yield* pulse(ex4() as any, 1.2, 0.4);
  yield* waitFor(0.3);

  // Breakdown
  const breakdown = createRef<Txt>();
  view.add(<Txt ref={breakdown} text={'P(disease|+) = 0.99\u00b70.01 / 0.0198\n= 0.0099/0.0198 = 50%'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={300} textAlign={'center'} lineHeight={50} opacity={0} />);
  yield* fadeIn(breakdown(), 0.4);

  // Tip
  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Base rate matters more than\nyou think! Prior \u00d7 Likelihood'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={550} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
