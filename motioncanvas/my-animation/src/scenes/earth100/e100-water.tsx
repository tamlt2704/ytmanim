import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';
import {addDotGrid, showGrid} from './dot-grid';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'💧 Water & Shelter'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} y={-820} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  // Water grid
  const waterLabel = createRef<Txt>();
  view.add(<Txt ref={waterLabel} text={'Clean drinking water?'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} y={-620} opacity={0} />);
  yield* fadeIn(waterLabel(), 0.2);

  const grid1 = addDotGrid(view, 0, -430, 20, 28);
  let idx = 0;
  for (let i = 0; i < 75; i++, idx++) grid1.dots[idx].fill(ACCENT_COLOR);
  for (let i = 0; i < 25; i++, idx++) grid1.dots[idx].fill(RED);
  yield* showGrid(grid1, 0.3);

  const w1 = createRef<Rect>();
  const w2 = createRef<Rect>();
  view.add(
    <Rect ref={w1} width={200} height={45} radius={10} fill={ACCENT_COLOR + '18'} x={-110} y={-260} opacity={0}>
      <Rect width={18} height={18} radius={9} fill={ACCENT_COLOR} x={-70} />
      <Txt text={'75 yes'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={15} />
    </Rect>,
  );
  view.add(
    <Rect ref={w2} width={200} height={45} radius={10} fill={RED + '18'} x={110} y={-260} opacity={0}>
      <Rect width={18} height={18} radius={9} fill={RED} x={-70} />
      <Txt text={'25 no'} fill={RED} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={15} />
    </Rect>,
  );
  yield* all(w1().opacity(1, 0.2), w2().opacity(1, 0.2));
  yield* waitFor(1);

  // Shelter grid
  const shelterLabel = createRef<Txt>();
  view.add(<Txt ref={shelterLabel} text={'Have adequate shelter?'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} y={-180} opacity={0} />);
  yield* fadeIn(shelterLabel(), 0.2);

  const grid2 = addDotGrid(view, 0, 10, 20, 28);
  idx = 0;
  for (let i = 0; i < 77; i++, idx++) grid2.dots[idx].fill(GREEN);
  for (let i = 0; i < 23; i++, idx++) grid2.dots[idx].fill(ORANGE);
  yield* showGrid(grid2, 0.3);

  const s1 = createRef<Rect>();
  const s2 = createRef<Rect>();
  view.add(
    <Rect ref={s1} width={200} height={45} radius={10} fill={GREEN + '18'} x={-110} y={180} opacity={0}>
      <Rect width={18} height={18} radius={9} fill={GREEN} x={-70} />
      <Txt text={'77 yes'} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={15} />
    </Rect>,
  );
  view.add(
    <Rect ref={s2} width={200} height={45} radius={10} fill={ORANGE + '18'} x={110} y={180} opacity={0}>
      <Rect width={18} height={18} radius={9} fill={ORANGE} x={-70} />
      <Txt text={'23 no'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={15} />
    </Rect>,
  );
  yield* all(s1().opacity(1, 0.2), s2().opacity(1, 0.2));

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'25 people would not have\nclean water to drink 😔'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={290} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeIn(fact(), 0.3);

  yield* waitFor(2.5);
});
