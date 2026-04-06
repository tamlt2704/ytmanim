import {Rect, Txt, Circle, makeScene2D, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#7'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Splits'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={110} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Multiple Windows'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  // Vim window visualization
  const frame = createRef<Rect>();
  const pane1 = createRef<Rect>();
  const pane2 = createRef<Rect>();
  const splitLine = createRef<Line>();

  view.add(
    <Rect ref={frame} width={800} height={500} y={-50} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={800} height={50} y={-225} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-350} /><Circle size={16} fill={ORANGE} x={-320} /><Circle size={16} fill={GREEN} x={-290} />
        <Txt text={'vim'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Rect ref={pane1} width={780} height={430} y={10} fill={TERMINAL_BG}>
        <Txt text={'app.js'} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} y={-180} />
        <Txt text={'const app = express();'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} y={-140} />
      </Rect>
      <Rect ref={pane2} width={0} height={430} x={200} y={10} fill={'#1a2332'} opacity={0}>
        <Txt text={'test.js'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={22} y={-180} />
        <Txt text={'describe("app"...'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} y={-140} />
      </Rect>
      <Line ref={splitLine} points={[[0, -200], [0, 220]]} stroke={GREEN} lineWidth={2} opacity={0} />
    </Rect>
  );

  const shortcut = createRef<Txt>();
  view.add(<Txt ref={shortcut} text={''} fill={ORANGE} fontFamily={CODE_FONT} fontSize={34} fontWeight={800} y={350} opacity={0} />);
  view.add(<Txt ref={tip} text={'Ctrl+w then h/j/k/l\nto navigate between splits 🪟'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={520} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);
  yield* all(frame().opacity(1, 0.4), frame().scale(1, 0.5, easeOutCubic));
  yield* waitFor(0.5);

  yield* all(shortcut().opacity(1, 0.3), shortcut().text(':vsp test.js → Vertical Split', 0.3));
  yield* all(
    pane1().width(380, 0.5, easeInOutCubic), pane1().x(-200, 0.5, easeInOutCubic),
    pane2().opacity(1, 0.3), pane2().width(380, 0.5, easeInOutCubic),
    splitLine().opacity(1, 0.3),
  );
  yield* waitFor(0.5);
  yield* shortcut().text(':sp → Horizontal Split', 0.3);
  yield* waitFor(0.5);
  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
