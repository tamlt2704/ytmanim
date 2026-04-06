import {Rect, Txt, Circle, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const lines = createRefArray<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#8'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'ln -s'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={120} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Symbolic Links'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  view.add(
    <Rect ref={terminal} width={900} height={400} y={-130} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-175} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} /><Circle size={16} fill={ORANGE} x={-370} /><Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'Terminal'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={lines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} x={-410} y={-100} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-40} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Link visualization
  const source = createRef<Rect>();
  const link = createRef<Rect>();
  const arrow = createRef<Line>();
  view.add(
    <Node y={300}>
      <Rect ref={source} x={-220} width={220} height={110} radius={12} fill={GREEN} opacity={0} scale={0}>
        <Txt text={'📄'} fontSize={36} y={-15} />
        <Txt text={'/etc/nginx.conf'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={16} y={28} />
      </Rect>
      <Line ref={arrow} points={[[-100, 0], [100, 0]]} stroke={PURPLE} lineWidth={4} endArrow opacity={0} />
      <Rect ref={link} x={220} width={220} height={110} radius={12} fill={PURPLE} opacity={0} scale={0}>
        <Txt text={'🔗'} fontSize={36} y={-15} />
        <Txt text={'~/nginx.conf'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={16} y={28} />
      </Rect>
    </Node>
  );

  view.add(<Txt ref={tip} text={'Symlinks are shortcuts —\nchanges reflect in both places 🔗'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={500} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);
  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  yield* lines[0].opacity(1, 0.2);
  const cmd = '$ ln -s /etc/nginx.conf ~/nginx.conf';
  for (let i = 0; i <= cmd.length; i++) { lines[0].text(cmd.slice(0, i) + '▌'); yield* waitFor(0.04); }
  lines[0].text(cmd);
  yield* all(lines[1].opacity(1, 0.3), lines[1].text('Symlink created ✓', 0.4));
  yield* waitFor(0.3);

  yield* all(source().opacity(1, 0.3), source().scale(1, 0.4, easeOutCubic));
  yield* arrow().opacity(1, 0.3);
  yield* all(link().opacity(1, 0.3), link().scale(1, 0.4, easeOutCubic));
  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
