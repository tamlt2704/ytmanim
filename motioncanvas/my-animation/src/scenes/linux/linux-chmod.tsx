import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const lines = createRefArray<Txt>();
  const badge = createRef<Rect>();
  const tip = createRef<Txt>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#7'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'chmod'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={120} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Change Permissions'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  view.add(
    <Rect ref={terminal} width={900} height={500} y={-100} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-225} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} /><Circle size={16} fill={ORANGE} x={-370} /><Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'Terminal'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={lines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} x={-410} y={-130} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} x={-410} y={-70} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} x={-410} y={-10} offsetX={-1} opacity={0} />
      <Txt ref={lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} x={-410} y={50} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Permission boxes
  const perms = createRefArray<Rect>();
  const permData = [
    {label: 'r', desc: 'read', val: '4', color: GREEN, x: -280},
    {label: 'w', desc: 'write', val: '2', color: ORANGE, x: 0},
    {label: 'x', desc: 'exec', val: '1', color: RED, x: 280},
  ];
  for (const p of permData) {
    view.add(
      <Rect ref={perms} x={p.x} y={400} width={200} height={100} radius={14} fill={p.color} opacity={0} scale={0}>
        <Txt text={p.label} fill={'#fff'} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-15} />
        <Txt text={`${p.desc} = ${p.val}`} fill={'#fff'} fontFamily={CODE_FONT} fontSize={18} y={25} />
      </Rect>
    );
  }

  view.add(<Txt ref={tip} text={'755 = rwxr-xr-x\n644 = rw-r--r-- 🔐'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={570} textAlign={'center'} lineHeight={50} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);
  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  yield* lines[0].opacity(1, 0.2);
  const cmd = '$ chmod 755 deploy.sh';
  for (let i = 0; i <= cmd.length; i++) { lines[0].text(cmd.slice(0, i) + '▌'); yield* waitFor(0.05); }
  lines[0].text(cmd);
  yield* all(lines[1].opacity(1, 0.3), lines[1].text('-rwxr-xr-x deploy.sh ✓', 0.4));
  yield* waitFor(0.2);
  yield* all(lines[2].opacity(1, 0.2), lines[2].text('$ chmod +x script.sh', 0.3));
  yield* all(lines[3].opacity(1, 0.3), lines[3].text('Execute permission added ✓', 0.4));
  yield* waitFor(0.3);

  for (let i = 0; i < 3; i++) {
    yield* all(perms[i].opacity(1, 0.2), perms[i].scale(1, 0.3, easeOutCubic));
  }
  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
