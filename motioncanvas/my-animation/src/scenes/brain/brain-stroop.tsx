import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#1', topic: 'BRAIN', command: 'Stroop Effect', commandColor: ORANGE, emoji: '🧠', subtitle: 'Say the COLOR not the WORD!'});

  const title = createRef<Txt>();
  const challenge = createRef<Txt>();
  const words = createRefArray<Txt>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(<Txt ref={title} text={'Say the COLOR, not the word!'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={44} y={-780} opacity={0} />);

  const stroopData = [
    {text: 'RED', color: '#58a6ff'},
    {text: 'GREEN', color: '#f85149'},
    {text: 'BLUE', color: '#3fb950'},
    {text: 'YELLOW', color: '#bc8cff'},
    {text: 'PURPLE', color: '#d29922'},
    {text: 'ORANGE', color: '#39d353'},
  ];

  stroopData.forEach((d, i) => {
    view.add(<Txt ref={words} text={d.text} fill={d.color} fontFamily={TITLE_FONT} fontSize={90} fontWeight={800} y={-550 + i * 170} opacity={0} scale={0} />);
  });

  view.add(<Txt ref={reveal} text={'Your brain reads the WORD faster\nthan it processes the COLOR.\nThis conflict slows you down! 🤯'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={32} y={600} textAlign={'center'} lineHeight={52} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={820} opacity={0} />);

  yield* title().opacity(1, 0.4);
  yield* waitFor(0.5);

  for (const w of words) {
    yield* all(w.opacity(1, 0.3), w.scale(1, 0.4, easeOutCubic));
    yield* waitFor(0.6);
  }

  yield* waitFor(1);
  yield* reveal().opacity(1, 0.6);
  yield* waitFor(1);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
