import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';
import {addDotGrid, showGrid} from './dot-grid';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'📚 Literacy & Internet'} fill={PURPLE} fontFamily={TITLE_FONT} fontSize={52} fontWeight={900} y={-820} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  // Literacy grid
  const litLabel = createRef<Txt>();
  view.add(<Txt ref={litLabel} text={'Can read & write?'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} y={-620} opacity={0} />);
  yield* fadeIn(litLabel(), 0.2);

  const grid1 = addDotGrid(view, 0, -430, 20, 28);
  let idx = 0;
  for (let i = 0; i < 86; i++, idx++) grid1.dots[idx].fill(GREEN);
  for (let i = 0; i < 14; i++, idx++) grid1.dots[idx].fill(RED);
  yield* showGrid(grid1, 0.3);

  const lit1 = createRef<Rect>();
  const lit2 = createRef<Rect>();
  view.add(
    <Rect ref={lit1} width={200} height={45} radius={10} fill={GREEN + '18'} x={-110} y={-260} opacity={0}>
      <Rect width={18} height={18} radius={9} fill={GREEN} x={-70} />
      <Txt text={'86 yes'} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={15} />
    </Rect>,
  );
  view.add(
    <Rect ref={lit2} width={200} height={45} radius={10} fill={RED + '18'} x={110} y={-260} opacity={0}>
      <Rect width={18} height={18} radius={9} fill={RED} x={-70} />
      <Txt text={'14 no'} fill={RED} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={15} />
    </Rect>,
  );
  yield* all(lit1().opacity(1, 0.2), lit2().opacity(1, 0.2));
  yield* waitFor(1);

  // Internet grid
  const netLabel = createRef<Txt>();
  view.add(<Txt ref={netLabel} text={'Have internet access?'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} y={-180} opacity={0} />);
  yield* fadeIn(netLabel(), 0.2);

  const grid2 = addDotGrid(view, 0, 10, 20, 28);
  idx = 0;
  for (let i = 0; i < 63; i++, idx++) grid2.dots[idx].fill(ACCENT_COLOR);
  for (let i = 0; i < 37; i++, idx++) grid2.dots[idx].fill(ORANGE);
  yield* showGrid(grid2, 0.3);

  const net1 = createRef<Rect>();
  const net2 = createRef<Rect>();
  view.add(
    <Rect ref={net1} width={200} height={45} radius={10} fill={ACCENT_COLOR + '18'} x={-110} y={180} opacity={0}>
      <Rect width={18} height={18} radius={9} fill={ACCENT_COLOR} x={-70} />
      <Txt text={'63 yes'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={15} />
    </Rect>,
  );
  view.add(
    <Rect ref={net2} width={200} height={45} radius={10} fill={ORANGE + '18'} x={110} y={180} opacity={0}>
      <Rect width={18} height={18} radius={9} fill={ORANGE} x={-70} />
      <Txt text={'37 no'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={15} />
    </Rect>,
  );
  yield* all(net1().opacity(1, 0.2), net2().opacity(1, 0.2));

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'37 people would have\nno access to the internet'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={290} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeIn(fact(), 0.3);

  yield* waitFor(2.5);
});
