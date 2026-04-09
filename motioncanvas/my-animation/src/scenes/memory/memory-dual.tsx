import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#10 Dual Coding'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Words only — weak
  const wordsOnly = createRef<Rect>();
  view.add(
    <Rect ref={wordsOnly} width={400} height={120} radius={20} fill={RED + '15'} stroke={RED} lineWidth={3} y={-530} opacity={0} scale={0}>
      <Txt text={'📝 Words only'} fill={RED} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={-20} />
      <Txt text={'1 channel → weak'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={25} />
    </Rect>,
  );
  yield* all(wordsOnly().opacity(1, 0.2), wordsOnly().scale(1, 0.3, easeOutBack));
  yield* waitFor(0.3);

  // Words + images — strong
  const dual = createRef<Rect>();
  view.add(
    <Rect ref={dual} width={400} height={120} radius={20} fill={GREEN + '15'} stroke={GREEN} lineWidth={3} y={-340} opacity={0} scale={0}>
      <Txt text={'📝 + 🖼️ Words + Images'} fill={GREEN} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={-20} />
      <Txt text={'2 channels → STRONG!'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} y={25} />
    </Rect>,
  );
  yield* all(dual().opacity(1, 0.2), dual().scale(1, 0.3, easeOutBack));
  yield* pulse(dual() as any, 1.05, 0.3);

  // Examples
  const examples = [
    {text: '📊 Diagrams', color: ACCENT_COLOR},
    {text: '🗺️ Mind maps', color: PURPLE},
    {text: '✏️ Sketches', color: ORANGE},
  ];
  for (let i = 0; i < examples.length; i++) {
    const box = createRef<Rect>();
    view.add(
      <Rect ref={box} x={-200 + i * 200} y={-150} width={170} height={65} radius={14} fill={examples[i].color} opacity={0} scale={0}>
        <Txt text={examples[i].text} fill={'#fff'} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} />
      </Rect>,
    );
    yield* all(box().opacity(1, 0.15), box().scale(1, 0.25, easeOutBack));
  }

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Pair every concept\nwith a visual'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={46} fontWeight={800} y={10} textAlign={'center'} lineHeight={64} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Draw it, even badly!\nYour brain still benefits 🎨'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={180} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
