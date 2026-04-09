import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={600} fill={PURPLE} opacity={0.08} y={-200} />);
  view.add(<Rect width={300} height={300} x={-390} y={-810} rotation={45} fill={ACCENT_COLOR} opacity={0.15} />);
  view.add(<Rect width={200} height={200} x={390} y={810} rotation={45} fill={GREEN} opacity={0.15} />);
  view.add(<Txt text={'🧠'} fontSize={280} y={-380} />);
  view.add(<Txt text={'MEMORY'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={150} fontWeight={900} y={-100} letterSpacing={14} />);
  view.add(<Txt text={'TRICKS'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={130} fontWeight={900} y={60} letterSpacing={10} />);
  view.add(<Txt text={'Remember ANYTHING\nWith These 10 Hacks'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={36} y={260} textAlign={'center'} lineHeight={54} />);
  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'30s'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );
  view.add(<Txt text={'⚡'} fontSize={120} y={450} />);

  yield* waitFor(2);
});
