import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#2', topic: 'BRAIN', command: 'Blind Spot', commandColor: ACCENT_COLOR, emoji: '👻', subtitle: 'Can You Spot the HIDDEN Thing?'});

  const instruction = createRef<Txt>();
  const dots = createRefArray<Circle>();
  const hiddenTxt = createRef<Txt>();
  const countLabel = createRef<Txt>();
  const answer = createRef<Txt>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(<Txt ref={instruction} text={'Count the BLUE dots!'} fill={'#58a6ff'} fontFamily={TITLE_FONT} fontSize={56} y={-780} opacity={0} />);

  const dotData = [
    {x: -200, y: -450, color: '#58a6ff'},
    {x: 150, y: -350, color: ORANGE},
    {x: -100, y: -250, color: '#58a6ff'},
    {x: 250, y: -200, color: ORANGE},
    {x: 0, y: -100, color: ORANGE},
    {x: -250, y: -50, color: '#58a6ff'},
    {x: 200, y: 0, color: ORANGE},
    {x: -50, y: 100, color: '#58a6ff'},
    {x: 150, y: 200, color: ORANGE},
  ];

  dotData.forEach(d => {
    view.add(<Circle ref={dots} size={80} fill={d.color} x={d.x} y={d.y} opacity={0} scale={0} />);
  });

  view.add(<Txt ref={hiddenTxt} text={'👻'} fontSize={120} x={300} y={-450} opacity={0} />);
  view.add(<Txt ref={countLabel} text={'How many blue dots?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={400} opacity={0} />);
  view.add(<Txt ref={answer} text={'Answer: 4'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={64} fontWeight={800} y={500} opacity={0} />);
  view.add(<Txt ref={reveal} text={'But did you notice the 👻?\n\nThis is Inattentional Blindness —\nfocusing on one task makes you\nBLIND to other things! 🤯'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={500} textAlign={'center'} lineHeight={48} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={820} opacity={0} />);

  yield* instruction().opacity(1, 0.4);
  yield* waitFor(0.5);

  for (const d of dots) {
    yield* all(d.opacity(1, 0.2), d.scale(1, 0.3, easeOutCubic));
    yield* waitFor(0.15);
  }

  yield* waitFor(0.3);
  yield* hiddenTxt().opacity(0.6, 0.8);
  yield* waitFor(2);

  yield* countLabel().opacity(1, 0.4);
  yield* waitFor(1.5);
  yield* answer().opacity(1, 0.4);
  yield* waitFor(1);

  yield* all(
    ...dots.map(d => d.opacity(0, 0.5)),
    countLabel().opacity(0, 0.5),
    answer().opacity(0, 0.5),
    instruction().opacity(0, 0.5),
    hiddenTxt().opacity(1, 0.5),
    hiddenTxt().scale(2, 0.5, easeOutCubic),
  );

  yield* waitFor(0.5);
  yield* all(hiddenTxt().opacity(0, 0.3), reveal().opacity(1, 0.6));
  yield* waitFor(1.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
