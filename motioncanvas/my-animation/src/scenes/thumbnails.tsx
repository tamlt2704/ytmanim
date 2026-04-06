import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, CODE_FONT, TITLE_FONT, ORANGE, PURPLE, CYAN} from '../styles';

interface Thumb {
  command: string;
  color: string;
  emoji: string;
  subtitle: string;
}

interface Topic {
  title: string;
  thumbs: Thumb[];
}

const topics: Record<string, Topic> = {
  git: {
    title: 'GIT',
    thumbs: [
      {command: 'init', color: GREEN, emoji: '🚀', subtitle: 'Every Dev NEEDS This!'},
      {command: 'clone', color: PURPLE, emoji: '📦', subtitle: 'Copy ANY Repo Instantly!'},
      {command: 'commit', color: ORANGE, emoji: '💾', subtitle: 'Save Your Code RIGHT!'},
      {command: 'push', color: ACCENT_COLOR, emoji: '☁️', subtitle: 'Sync Like a PRO!'},
      {command: 'branch', color: CYAN, emoji: '🌿', subtitle: 'Work Without FEAR!'},
      {command: 'merge', color: RED, emoji: '🔀', subtitle: 'Combine Code EASILY!'},
      {command: 'status', color: GREEN, emoji: '📋', subtitle: "Know What's CHANGED!"},
      {command: 'stash', color: ORANGE, emoji: '🗃️', subtitle: 'Secret Dev TRICK!'},
    ],
  },
  docker: {
    title: 'DOCKER',
    thumbs: [
      {command: 'run', color: GREEN, emoji: '🐳', subtitle: 'Spin Up ANYTHING!'},
      {command: 'build', color: ORANGE, emoji: '📦', subtitle: 'Build Your Own Image!'},
      {command: 'ps', color: ACCENT_COLOR, emoji: '📋', subtitle: "See What's RUNNING!"},
      {command: 'exec', color: PURPLE, emoji: '🐚', subtitle: 'Get INSIDE Containers!'},
      {command: 'logs', color: GREEN, emoji: '📡', subtitle: 'Debug Like a PRO!'},
      {command: 'stop', color: RED, emoji: '🛑', subtitle: 'Graceful SHUTDOWN!'},
      {command: 'rm', color: RED, emoji: '🧹', subtitle: 'Clean Up FAST!'},
      {command: 'images', color: ACCENT_COLOR, emoji: '🖼️', subtitle: 'Manage Your Images!'},
      {command: 'volumes', color: PURPLE, emoji: '💾', subtitle: 'Persist Your DATA!'},
      {command: 'compose', color: GREEN, emoji: '🎯', subtitle: 'Multi-Container MAGIC!'},
    ],
  },
  linux: {
    title: 'LINUX',
    thumbs: [
      {command: 'grep', color: GREEN, emoji: '🔍', subtitle: 'Find ANYTHING!'},
      {command: 'find', color: ACCENT_COLOR, emoji: '📂', subtitle: 'Locate Files FAST!'},
      {command: 'awk', color: ORANGE, emoji: '📊', subtitle: 'Process Data Like a PRO!'},
      {command: 'sed', color: PURPLE, emoji: '✏️', subtitle: 'Edit Streams INSTANTLY!'},
      {command: 'xargs', color: GREEN, emoji: '🔗', subtitle: 'Chain Commands!'},
      {command: 'curl', color: ACCENT_COLOR, emoji: '🌐', subtitle: 'Talk to ANY Server!'},
      {command: 'chmod', color: ORANGE, emoji: '🔐', subtitle: 'Control ACCESS!'},
      {command: 'ln -s', color: PURPLE, emoji: '🔗', subtitle: 'Link Files SMART!'},
      {command: 'tar', color: ORANGE, emoji: '📦', subtitle: 'Archive EVERYTHING!'},
      {command: 'ssh', color: CYAN, emoji: '🖥️', subtitle: 'Remote Access PRO!'},
    ],
  },
  vim: {
    title: 'VIM',
    thumbs: [
      {command: 'Modes', color: GREEN, emoji: '🧘', subtitle: 'The 3 Essential Modes!'},
      {command: ':w :q', color: ORANGE, emoji: '💾', subtitle: 'Save & Quit!'},
      {command: '/search', color: ACCENT_COLOR, emoji: '🔍', subtitle: 'Find Text FAST!'},
      {command: 'dd', color: RED, emoji: '✂️', subtitle: 'Delete Like a PRO!'},
      {command: 'yy / p', color: GREEN, emoji: '📋', subtitle: 'Copy & Paste!'},
      {command: 'ciw', color: PURPLE, emoji: '⚡', subtitle: 'Most POWERFUL Combo!'},
      {command: 'Splits', color: ACCENT_COLOR, emoji: '🪟', subtitle: 'Multiple Windows!'},
      {command: 'Macros', color: ORANGE, emoji: '🔄', subtitle: 'Record & Replay!'},
      {command: ':s/o/n', color: GREEN, emoji: '✏️', subtitle: 'Find & Replace!'},
      {command: '.', color: GREEN, emoji: '⚡', subtitle: 'Repeat EVERYTHING!'},
    ],
  },
  sql: {
    title: 'SQL',
    thumbs: [
      {command: 'SELECT', color: ACCENT_COLOR, emoji: '📊', subtitle: 'Query Your Data!'},
      {command: 'WHERE', color: ORANGE, emoji: '🎯', subtitle: 'Filter Results!'},
      {command: 'JOIN', color: GREEN, emoji: '🔗', subtitle: 'Combine Tables!'},
      {command: 'GROUP BY', color: PURPLE, emoji: '📦', subtitle: 'Aggregate Data!'},
      {command: 'HAVING', color: ORANGE, emoji: '🎯', subtitle: 'Filter Groups!'},
      {command: 'Subquery', color: ACCENT_COLOR, emoji: '🪆', subtitle: 'Query in a Query!'},
      {command: 'INDEX', color: GREEN, emoji: '📖', subtitle: 'Speed Up Queries!'},
      {command: 'UNION', color: PURPLE, emoji: '📚', subtitle: 'Combine Results!'},
      {command: 'WINDOW', color: ACCENT_COLOR, emoji: '🪟', subtitle: 'Advanced Analytics!'},
      {command: 'CTE', color: GREEN, emoji: '✨', subtitle: 'Clean Queries!'},
    ],
  },
  regex: {
    title: 'REGEX',
    thumbs: [
      {command: 'Literals', color: GREEN, emoji: '🔤', subtitle: 'Exact Matching!'},
      {command: '[abc]', color: ACCENT_COLOR, emoji: '🎰', subtitle: 'Character Classes!'},
      {command: '* + ?', color: ORANGE, emoji: '🔢', subtitle: 'How Many Matches?'},
      {command: '^ $', color: PURPLE, emoji: '📍', subtitle: 'Anchor Your Pattern!'},
      {command: '( )', color: GREEN, emoji: '🎁', subtitle: 'Capture Groups!'},
      {command: 'a | b', color: ORANGE, emoji: '🔀', subtitle: 'Match Either!'},
      {command: '(?=)', color: ACCENT_COLOR, emoji: '👀', subtitle: 'Look Ahead!'},
      {command: '(?<=)', color: PURPLE, emoji: '👈', subtitle: 'Look Behind!'},
      {command: 'Greedy', color: RED, emoji: '🍔', subtitle: 'Greedy vs Lazy!'},
      {command: 'Patterns', color: GREEN, emoji: '🧩', subtitle: 'Common Patterns!'},
    ],
  },
  http: {
    title: 'HTTP',
    thumbs: [
      {command: '200', color: GREEN, emoji: '✅', subtitle: 'Everything is OK!'},
      {command: '201', color: GREEN, emoji: '🆕', subtitle: 'Resource Created!'},
      {command: '301', color: ORANGE, emoji: '📦', subtitle: 'Moved Permanently!'},
      {command: '400', color: RED, emoji: '❌', subtitle: 'Bad Request!'},
      {command: '401', color: RED, emoji: '🔒', subtitle: 'Who Are You?'},
      {command: '403', color: RED, emoji: '🚫', subtitle: 'Access DENIED!'},
      {command: '404', color: ORANGE, emoji: '🔍', subtitle: 'Not Found!'},
      {command: '429', color: ORANGE, emoji: '🐌', subtitle: 'Slow DOWN!'},
      {command: '500', color: RED, emoji: '💥', subtitle: 'Server BROKE!'},
      {command: '503', color: RED, emoji: '🔧', subtitle: 'Service DOWN!'},
    ],
  },
  css: {
    title: 'CSS',
    thumbs: [
      {command: 'Flexbox', color: ACCENT_COLOR, emoji: '📐', subtitle: '1D Layout MASTER!'},
      {command: 'Grid', color: GREEN, emoji: '🔲', subtitle: '2D Layout POWER!'},
      {command: 'clamp()', color: ORANGE, emoji: '📏', subtitle: 'Responsive Values!'},
      {command: ':has()', color: PURPLE, emoji: '🎯', subtitle: 'Parent Selector!'},
      {command: '@container', color: ACCENT_COLOR, emoji: '📦', subtitle: 'Container Queries!'},
      {command: 'aspect-ratio', color: GREEN, emoji: '🖼️', subtitle: 'Perfect Proportions!'},
      {command: 'scroll-snap', color: ORANGE, emoji: '📱', subtitle: 'Snap Scrolling!'},
      {command: '@layer', color: PURPLE, emoji: '🎂', subtitle: 'Cascade Control!'},
      {command: 'Nesting', color: GREEN, emoji: '🪺', subtitle: 'Native CSS Nesting!'},
      {command: 'View Trans', color: ACCENT_COLOR, emoji: '✨', subtitle: 'Page Transitions!'},
    ],
  },
  python: {
    title: 'PYTHON',
    thumbs: [
      {command: '[x for x]', color: GREEN, emoji: '🐍', subtitle: 'List Comp POWER!'},
      {command: '{k: v}', color: ACCENT_COLOR, emoji: '📖', subtitle: 'Dict Comp!'},
      {command: 'enumerate', color: ORANGE, emoji: '🔢', subtitle: 'Index + Value!'},
      {command: 'zip()', color: GREEN, emoji: '🤝', subtitle: 'Pair Up Lists!'},
      {command: ':=', color: PURPLE, emoji: '🦭', subtitle: 'Walrus Operator!'},
      {command: '* unpack', color: ORANGE, emoji: '⭐', subtitle: 'Star Unpacking!'},
      {command: "f'{}'", color: GREEN, emoji: '📝', subtitle: 'Format Strings!'},
      {command: 'defaultdict', color: ACCENT_COLOR, emoji: '🗝️', subtitle: 'Auto-Init Keys!'},
      {command: 'Counter', color: ORANGE, emoji: '🔢', subtitle: 'Count Anything!'},
      {command: 'any/all', color: GREEN, emoji: '✅', subtitle: 'Test Collections!'},
    ],
  },
  aws: {
    title: 'AWS',
    thumbs: [
      {command: 'EC2', color: ORANGE, emoji: '🖥️', subtitle: 'Virtual Servers!'},
      {command: 'S3', color: GREEN, emoji: '🪣', subtitle: 'Infinite Storage!'},
      {command: 'Lambda', color: PURPLE, emoji: '⚡', subtitle: 'Serverless MAGIC!'},
      {command: 'DynamoDB', color: ACCENT_COLOR, emoji: '🗄️', subtitle: 'NoSQL at Scale!'},
      {command: 'SQS', color: ORANGE, emoji: '📬', subtitle: 'Message Queue!'},
      {command: 'SNS', color: RED, emoji: '📢', subtitle: 'Broadcast Messages!'},
      {command: 'CloudFront', color: GREEN, emoji: '🌍', subtitle: 'Global CDN!'},
      {command: 'IAM', color: RED, emoji: '🔐', subtitle: 'Access Control!'},
      {command: 'RDS', color: ACCENT_COLOR, emoji: '🐘', subtitle: 'Managed SQL!'},
      {command: 'ECS', color: CYAN, emoji: '🐳', subtitle: 'Run Containers!'},
    ],
  },
  networking: {
    title: 'NETWORK',
    thumbs: [
      {command: 'IP', color: ACCENT_COLOR, emoji: '🏠', subtitle: 'Device Identity!'},
      {command: 'TCP/UDP', color: GREEN, emoji: '📦', subtitle: 'Transport Layer!'},
      {command: 'DNS', color: ORANGE, emoji: '📖', subtitle: 'Name → IP!'},
      {command: 'Ports', color: PURPLE, emoji: '🚪', subtitle: 'Service Endpoints!'},
      {command: 'HTTPS', color: GREEN, emoji: '🌐', subtitle: 'Secure Web!'},
      {command: 'Latency', color: ORANGE, emoji: '⏱️', subtitle: 'Network Delay!'},
      {command: 'LB', color: ACCENT_COLOR, emoji: '⚖️', subtitle: 'Balance Traffic!'},
      {command: 'CDN', color: GREEN, emoji: '🌍', subtitle: 'Edge Caching!'},
      {command: 'Firewall', color: RED, emoji: '🧱', subtitle: 'Block Threats!'},
      {command: 'CORS', color: ORANGE, emoji: '🔗', subtitle: 'Cross-Origin!'},
    ],
  },
};

// ← Change this to match your current topic in project.ts
const TOPIC = 'docker';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const {title: topicTitle, thumbs} = topics[TOPIC];

  const bg = createRef<Rect>();
  const mainTitle = createRef<Txt>();
  const commandTxt = createRef<Txt>();
  const emoji = createRef<Txt>();
  const badge = createRef<Rect>();
  const badgeTxt = createRef<Txt>();
  const glowCircle = createRef<Circle>();
  const subtitleTxt = createRef<Txt>();
  const cornerAccent1 = createRef<Rect>();
  const cornerAccent2 = createRef<Rect>();

  view.add(<Rect ref={bg} width={1080} height={1920} fill={BG_COLOR} />);
  view.add(<Circle ref={glowCircle} size={600} fill={thumbs[0].color} opacity={0} y={-100} />);
  view.add(<Rect ref={cornerAccent1} width={300} height={300} x={-390} y={-810} rotation={45} fill={GREEN} opacity={0} />);
  view.add(<Rect ref={cornerAccent2} width={200} height={200} x={390} y={810} rotation={45} fill={PURPLE} opacity={0} />);

  view.add(
    <Txt ref={mainTitle} text={topicTitle} fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={250} fontWeight={900} y={-300} opacity={0} letterSpacing={20} />
  );
  view.add(
    <Txt ref={commandTxt} text={thumbs[0].command} fill={thumbs[0].color} fontFamily={CODE_FONT}
      fontSize={160} fontWeight={900} y={-50} opacity={0} />
  );
  view.add(<Txt ref={emoji} text={thumbs[0].emoji} fontSize={200} y={250} opacity={0} />);
  view.add(
    <Txt ref={subtitleTxt} text={thumbs[0].subtitle} fill={ORANGE} fontFamily={TITLE_FONT}
      fontSize={52} y={500} opacity={0} textAlign={'center'} />
  );
  view.add(
    <Rect ref={badge} x={350} y={-800} width={180} height={180} radius={90} fill={RED} opacity={0} scale={0}>
      <Txt ref={badgeTxt} text={'#1'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={70} fontWeight={900} />
    </Rect>
  );

  // Show first thumbnail
  yield* all(
    glowCircle().opacity(0.08, 0.3),
    cornerAccent1().opacity(0.15, 0.3),
    cornerAccent2().opacity(0.15, 0.3),
    mainTitle().opacity(1, 0.3),
    commandTxt().opacity(1, 0.3),
    emoji().opacity(1, 0.3),
    subtitleTxt().opacity(1, 0.3),
    badge().opacity(1, 0.3),
    badge().scale(1, 0.3, easeOutCubic),
  );
  yield* waitFor(2);

  // Cycle through remaining thumbnails
  for (let i = 1; i < thumbs.length; i++) {
    const t = thumbs[i];
    yield* all(
      commandTxt().text(t.command, 0.3),
      commandTxt().fill(t.color, 0.3),
      emoji().text(t.emoji, 0.3),
      glowCircle().fill(t.color, 0.3),
      subtitleTxt().text(t.subtitle, 0.3),
      badgeTxt().text(`#${i + 1}`, 0.3),
    );
    yield* waitFor(2);
  }
});
