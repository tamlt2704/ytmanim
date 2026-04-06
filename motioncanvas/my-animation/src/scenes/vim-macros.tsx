import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, CODE_FONT, TITLE_FONT, ORANGE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#8'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Macros'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={110} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Record & Replay'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  const steps = createRefArray<Rect>();
  const stepData = [
    {step: '1', cmd: 'qa', desc: 'Start recording to register a', color: RED, y: -200},
    {step: '2', cmd: '...', desc: 'Perform your edits', color: ORANGE, y: -50},
    {step: '3', cmd: 'q', desc: 'Stop recording', color: RED, y: 100},
    {step: '4', cmd: '@a', desc: 'Replay macro', color: GREEN, y: 250},
  ];
  for (const s of stepData) {
    view.add(
      <Rect ref={steps} width={750} height={120} y={s.y} radius={16} fill={TERMINAL_BG} stroke={s.color} lineWidth={3} opacity={0} scale={0.8}>
        <Rect x={-310} width={50} height={50} radius={25} fill={s.color}><Txt text={s.step} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={28} /></Rect>
        <Txt text={s.cmd} fill={s.color} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} x={-180} />
        <Txt text={s.desc} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} x={80} />
      </Rect>
    );
  }

  view.add(<Txt ref={tip} text={'100@a replays macro 100 times!\nAutomate repetitive edits 🔄'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={550} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.3);
  for (let i = 0; i < 4; i++) {
    yield* all(steps[i].opacity(1, 0.3), steps[i].scale(1, 0.4, easeOutCubic));
    yield* waitFor(0.2);
  }
  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
