import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#4 Find Files'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const good = createRef<Rect>();
  view.add(
    <Rect ref={good} width={480} height={70} radius={35} fill={TERMINAL_BG} stroke={ORANGE} lineWidth={3} y={-530} opacity={0} scale={0}>
      <Txt text={'🔍 machine learning filetype:pdf'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={23} fontWeight={700} />
    </Rect>,
  );
  yield* all(good().opacity(1, 0.2), good().scale(1, 0.3, easeOutBack));

  const result = createRef<Txt>();
  view.add(<Txt ref={result} text={'✅ Direct PDF downloads!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-440} opacity={0} />);
  yield* fadeIn(result(), 0.2);

  const syntax = createRef<Rect>();
  view.add(
    <Rect ref={syntax} width={420} height={90} radius={18} fill={ORANGE + '15'} stroke={ORANGE} lineWidth={3} y={-300} opacity={0} scale={0}>
      <Txt text={'filetype:ext'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={44} fontWeight={900} />
    </Rect>,
  );
  yield* all(syntax().opacity(1, 0.2), syntax().scale(1, 0.3, easeOutBack));
  yield* pulse(syntax() as any, 1.05, 0.3);

  // File type examples
  const types = [
    {ext: 'pdf', desc: 'Research papers', color: RED},
    {ext: 'pptx', desc: 'Presentations', color: ORANGE},
    {ext: 'xlsx', desc: 'Spreadsheets', color: GREEN},
    {ext: 'csv', desc: 'Datasets', color: ACCENT_COLOR},
  ];
  for (let i = 0; i < types.length; i++) {
    const t = types[i];
    const box = createRef<Rect>();
    view.add(
      <Rect ref={box} width={400} height={60} radius={14} fill={t.color + '18'} stroke={t.color} lineWidth={2} y={-140 + i * 80} opacity={0} scale={0}>
        <Txt text={`.${t.ext}`} fill={t.color} fontFamily={CODE_FONT} fontSize={28} fontWeight={900} x={-130} />
        <Txt text={t.desc} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} x={60} />
      </Rect>,
    );
    yield* all(box().opacity(1, 0.12), box().scale(1, 0.2, easeOutBack));
  }

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Free textbooks, cheat sheets,\ndatasets — all one search away 📚'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={260} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
