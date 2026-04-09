import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'THE FULL PICTURE'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} y={-820} letterSpacing={6} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  // Summary table
  const rows = [
    {spec: 'RAM', apollo: '74 KB', phone: '8 GB', mult: '100,000x', color: ACCENT_COLOR},
    {spec: 'CPU', apollo: '0.043 MHz', phone: '3,000 MHz', mult: '100,000x', color: GREEN},
    {spec: 'Storage', apollo: '72 KB', phone: '256 GB', mult: '3,500,000x', color: PURPLE},
    {spec: 'Weight', apollo: '32 kg', phone: '200 g', mult: '160x lighter', color: ORANGE},
    {spec: 'Power', apollo: '70 W', phone: '5 W', mult: '14x less', color: RED},
    {spec: 'Price', apollo: '$1.2M*', phone: '$1,000', mult: '1,200x cheaper', color: GREEN},
  ];

  // Headers
  const hdr = createRef<Rect>();
  view.add(
    <Rect ref={hdr} width={470} height={55} radius={12} fill={'#21262d'} y={-680} opacity={0}>
      <Txt text={'Spec'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} fontWeight={800} x={-190} />
      <Txt text={'🚀'} fontSize={22} x={-90} />
      <Txt text={'📱'} fontSize={22} x={0} />
      <Txt text={'Diff'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} fontWeight={800} x={130} />
    </Rect>,
  );
  yield* hdr().opacity(1, 0.3);

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const row = createRef<Rect>();
    view.add(
      <Rect ref={row} width={470} height={60} radius={10} fill={r.color + '10'} y={-610 + i * 70} opacity={0}>
        <Txt text={r.spec} fill={r.color} fontFamily={CODE_FONT} fontSize={18} fontWeight={800} x={-190} />
        <Txt text={r.apollo} fill={ORANGE} fontFamily={CODE_FONT} fontSize={16} fontWeight={700} x={-85} />
        <Txt text={r.phone} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={16} fontWeight={700} x={5} />
        <Txt text={r.mult} fill={RED} fontFamily={CODE_FONT} fontSize={16} fontWeight={900} x={140} />
      </Rect>,
    );
    yield* row().opacity(1, 0.2);
    yield* waitFor(0.4);
  }

  yield* waitFor(1);

  // Mind blow
  const blow = createRef<Rect>();
  view.add(
    <Rect ref={blow} width={460} height={120} radius={22} fill={RED + '18'} stroke={RED} lineWidth={4} y={-150} opacity={0} scale={0}>
      <Txt text={'🤯'} fontSize={50} x={-180} />
      <Txt text={'Yet Apollo 11\nreached the MOON'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={34} fontWeight={900} x={30} textAlign={'center'} lineHeight={46} />
    </Rect>,
  );
  yield* all(blow().opacity(1, 0.3), blow().scale(1, 0.4, easeOutBack));
  yield* pulse(blow() as any, 1.06, 0.4);

  const lesson = createRef<Txt>();
  view.add(<Txt ref={lesson} text={"It's not about the hardware\nIt's about the engineers 👨‍🚀"} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={36} fontWeight={800} y={10} textAlign={'center'} lineHeight={52} opacity={0} />);
  yield* fadeInUp(lesson(), 20, 0.4);

  const footnote = createRef<Txt>();
  view.add(<Txt ref={footnote} text={'*adjusted for inflation'} fill={'#484f58'} fontFamily={CODE_FONT} fontSize={18} y={120} opacity={0} />);
  yield* fadeIn(footnote(), 0.2);

  yield* waitFor(3);
});
