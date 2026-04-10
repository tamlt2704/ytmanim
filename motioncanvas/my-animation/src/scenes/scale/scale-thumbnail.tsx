import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={800} fill={PURPLE} opacity={0.04} y={-300} />);
  view.add(<Rect width={300} height={300} x={-390} y={-810} rotation={45} fill={ACCENT_COLOR} opacity={0.15} />);
  view.add(<Rect width={200} height={200} x={390} y={810} rotation={45} fill={GREEN} opacity={0.15} />);

  // Nested scale circles
  const cx = 0, cy = -400;
  const rings = [
    {size: 340, color: PURPLE, label: 'Universe'},
    {size: 270, color: ACCENT_COLOR, label: 'Galaxy'},
    {size: 200, color: GREEN, label: 'Solar System'},
    {size: 140, color: ORANGE, label: 'Earth'},
    {size: 85, color: RED, label: 'Human'},
    {size: 40, color: TEXT_COLOR, label: 'Cell'},
  ];
  for (const r of rings) {
    view.add(<Circle x={cx} y={cy} size={r.size} fill={null} stroke={r.color} lineWidth={2} opacity={0.6} />);
  }
  // Tiny dot at center = atom
  view.add(<Circle x={cx} y={cy} size={10} fill={TEXT_COLOR} />);

  // Labels along right side
  for (let i = 0; i < rings.length; i++) {
    const r = rings[i];
    view.add(
      <Txt text={r.label} fill={r.color} fontFamily={CODE_FONT} fontSize={18} fontWeight={700}
        x={200 + (i % 2) * 40} y={cy - 150 + i * 55} opacity={0.8} />,
    );
  }

  view.add(<Txt text={'SCALE'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={130} fontWeight={900} y={-60} />);
  view.add(<Txt text={'OF THE'} fill={'#8b949e'} fontFamily={TITLE_FONT} fontSize={70} fontWeight={900} y={60} />);
  view.add(<Txt text={'UNIVERSE'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={120} fontWeight={900} y={180} letterSpacing={8} />);
  view.add(<Txt text={'From atoms to the cosmos'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={310} />);

  // Size range
  view.add(<Txt text={'10⁻¹⁰ m'} fill={RED} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} x={-180} y={400} />);
  view.add(<Txt text={'→'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={36} x={0} y={400} />);
  view.add(<Txt text={'10²⁶ m'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} x={180} y={400} />);

  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'2m'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );

  yield* waitFor(3);
});
