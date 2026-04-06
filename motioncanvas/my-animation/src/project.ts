import {makeProject} from '@motion-canvas/core';

// Git
import gitInit from './scenes/git-init?scene';
import gitClone from './scenes/git-clone?scene';
import gitAddCommit from './scenes/git-add-commit?scene';
import gitPushPull from './scenes/git-push-pull?scene';
import gitBranch from './scenes/git-branch?scene';
import gitMerge from './scenes/git-merge?scene';
import gitStatusLog from './scenes/git-status-log?scene';
import gitStash from './scenes/git-stash?scene';
import gitBisect from './scenes/git-bisect?scene';
import gitReflog from './scenes/git-reflog?scene';
import gitCherryPick from './scenes/git-cherry-pick?scene';
import gitBlame from './scenes/git-blame?scene';
import gitWorktree from './scenes/git-worktree?scene';
import thumbnails from './scenes/thumbnails?scene';
import tmuxCheatsheet from './scenes/tmux-cheatsheet?scene';

// Docker
import dockerRun from './scenes/docker-run?scene';
import dockerBuild from './scenes/docker-build?scene';
import dockerPs from './scenes/docker-ps?scene';
import dockerExec from './scenes/docker-exec?scene';
import dockerLogs from './scenes/docker-logs?scene';
import dockerStop from './scenes/docker-stop?scene';
import dockerRm from './scenes/docker-rm?scene';
import dockerImages from './scenes/docker-images?scene';
import dockerVolumes from './scenes/docker-volumes?scene';
import dockerCompose from './scenes/docker-compose?scene';

// Linux
import linuxGrep from './scenes/linux-grep?scene';
import linuxFind from './scenes/linux-find?scene';
import linuxAwk from './scenes/linux-awk?scene';
import linuxSed from './scenes/linux-sed?scene';
import linuxXargs from './scenes/linux-xargs?scene';
import linuxCurl from './scenes/linux-curl?scene';
import linuxChmod from './scenes/linux-chmod?scene';
import linuxLn from './scenes/linux-ln?scene';
import linuxTar from './scenes/linux-tar?scene';
import linuxSsh from './scenes/linux-ssh?scene';

// Vim
import vimModes from './scenes/vim-modes?scene';
import vimSaveQuit from './scenes/vim-save-quit?scene';
import vimSearch from './scenes/vim-search?scene';
import vimDd from './scenes/vim-dd?scene';
import vimYankPaste from './scenes/vim-yank-paste?scene';
import vimCiw from './scenes/vim-ciw?scene';
import vimSplits from './scenes/vim-splits?scene';
import vimMacros from './scenes/vim-macros?scene';
import vimSubstitute from './scenes/vim-substitute?scene';
import vimDot from './scenes/vim-dot?scene';

// SQL
import sqlSelect from './scenes/sql-select?scene';
import sqlWhere from './scenes/sql-where?scene';
import sqlJoin from './scenes/sql-join?scene';
import sqlGroupBy from './scenes/sql-group-by?scene';
import sqlHaving from './scenes/sql-having?scene';
import sqlSubquery from './scenes/sql-subquery?scene';
import sqlIndex from './scenes/sql-index?scene';
import sqlUnion from './scenes/sql-union?scene';
import sqlWindow from './scenes/sql-window?scene';
import sqlCte from './scenes/sql-cte?scene';

// Regex
import regexLiterals from './scenes/regex-literals?scene';
import regexCharClass from './scenes/regex-char-class?scene';
import regexQuantifiers from './scenes/regex-quantifiers?scene';
import regexAnchors from './scenes/regex-anchors?scene';
import regexGroups from './scenes/regex-groups?scene';
import regexAlternation from './scenes/regex-alternation?scene';
import regexLookahead from './scenes/regex-lookahead?scene';
import regexLookbehind from './scenes/regex-lookbehind?scene';
import regexGreedy from './scenes/regex-greedy?scene';
import regexPatterns from './scenes/regex-patterns?scene';

// HTTP Status Codes
import http200 from './scenes/http-200?scene';
import http201 from './scenes/http-201?scene';
import http301 from './scenes/http-301?scene';
import http400 from './scenes/http-400?scene';
import http401 from './scenes/http-401?scene';
import http403 from './scenes/http-403?scene';
import http404 from './scenes/http-404?scene';
import http429 from './scenes/http-429?scene';
import http500 from './scenes/http-500?scene';
import http503 from './scenes/http-503?scene';

// CSS
import cssFlexbox from './scenes/css-flexbox?scene';
import cssGrid from './scenes/css-grid?scene';
import cssClamp from './scenes/css-clamp?scene';
import cssHas from './scenes/css-has?scene';
import cssContainer from './scenes/css-container?scene';
import cssAspect from './scenes/css-aspect?scene';
import cssScrollSnap from './scenes/css-scroll-snap?scene';
import cssLayer from './scenes/css-layer?scene';
import cssNesting from './scenes/css-nesting?scene';
import cssViewTransitions from './scenes/css-view-transitions?scene';

// Python
import pyListComp from './scenes/py-list-comp?scene';
import pyDictComp from './scenes/py-dict-comp?scene';
import pyEnumerate from './scenes/py-enumerate?scene';
import pyZip from './scenes/py-zip?scene';
import pyWalrus from './scenes/py-walrus?scene';
import pyUnpacking from './scenes/py-unpacking?scene';
import pyFstrings from './scenes/py-fstrings?scene';
import pyDefaultdict from './scenes/py-defaultdict?scene';
import pyCounter from './scenes/py-counter?scene';
import pyAnyAll from './scenes/py-any-all?scene';

// AWS
import awsEc2 from './scenes/aws-ec2?scene';
import awsS3 from './scenes/aws-s3?scene';
import awsLambda from './scenes/aws-lambda?scene';
import awsDynamodb from './scenes/aws-dynamodb?scene';
import awsSqs from './scenes/aws-sqs?scene';
import awsSns from './scenes/aws-sns?scene';
import awsCloudfront from './scenes/aws-cloudfront?scene';
import awsIam from './scenes/aws-iam?scene';
import awsRds from './scenes/aws-rds?scene';
import awsEcs from './scenes/aws-ecs?scene';

// Networking
import netIp from './scenes/net-ip?scene';
import netTcpUdp from './scenes/net-tcp-udp?scene';
import netDns from './scenes/net-dns?scene';
import netPorts from './scenes/net-ports?scene';
import netHttp from './scenes/net-http?scene';
import netLatency from './scenes/net-latency?scene';
import netLoadBalancer from './scenes/net-load-balancer?scene';
import netCdn from './scenes/net-cdn?scene';
import netFirewall from './scenes/net-firewall?scene';
import netCors from './scenes/net-cors?scene';

// LeetCode: Two Pointers
import tpTwoSum from './scenes/tp-two-sum?scene';
import tpPalindrome from './scenes/tp-palindrome?scene';
import tpThreeSum from './scenes/tp-three-sum?scene';
import tpContainerWater from './scenes/tp-container-water?scene';
import tpTrappingRain from './scenes/tp-trapping-rain?scene';
import tpMoveZeroes from './scenes/tp-move-zeroes?scene';
import tpSortColors from './scenes/tp-sort-colors?scene';

// LeetCode: Sliding Window
import swBuySell from './scenes/sw-buy-sell?scene';
import swLongestSubstr from './scenes/sw-longest-substr?scene';
import swCharReplace from './scenes/sw-char-replace?scene';
import swMinWindow from './scenes/sw-min-window?scene';
import swMaxSumK from './scenes/sw-max-sum-k?scene';
import swPermutation from './scenes/sw-permutation?scene';
import swWindowMax from './scenes/sw-window-max?scene';

// LeetCode: HashMap / HashSet
import hmTwoSum from './scenes/hm-two-sum?scene';
import hmGroupAnagrams from './scenes/hm-group-anagrams?scene';
import hmValidAnagram from './scenes/hm-valid-anagram?scene';
import hmContainsDup from './scenes/hm-contains-dup?scene';
import hmTopKFreq from './scenes/hm-top-k-freq?scene';
import hmLongestConsec from './scenes/hm-longest-consec?scene';
import hmEncodeDecode from './scenes/hm-encode-decode?scene';

const git = [gitInit, gitClone, gitAddCommit, gitPushPull, gitBranch, gitMerge, gitStatusLog, gitStash, gitBisect, gitReflog, gitCherryPick, gitBlame, gitWorktree];
const tmux = [tmuxCheatsheet];
const docker = [dockerRun, dockerBuild, dockerPs, dockerExec, dockerLogs, dockerStop, dockerRm, dockerImages, dockerVolumes, dockerCompose];
const linux = [linuxGrep, linuxFind, linuxAwk, linuxSed, linuxXargs, linuxCurl, linuxChmod, linuxLn, linuxTar, linuxSsh];
const vim = [vimModes, vimSaveQuit, vimSearch, vimDd, vimYankPaste, vimCiw, vimSplits, vimMacros, vimSubstitute, vimDot];
const sql = [sqlSelect, sqlWhere, sqlJoin, sqlGroupBy, sqlHaving, sqlSubquery, sqlIndex, sqlUnion, sqlWindow, sqlCte];
const regex = [regexLiterals, regexCharClass, regexQuantifiers, regexAnchors, regexGroups, regexAlternation, regexLookahead, regexLookbehind, regexGreedy, regexPatterns];
const http = [http200, http201, http301, http400, http401, http403, http404, http429, http500, http503];
const css = [cssFlexbox, cssGrid, cssClamp, cssHas, cssContainer, cssAspect, cssScrollSnap, cssLayer, cssNesting, cssViewTransitions];
const python = [pyListComp, pyDictComp, pyEnumerate, pyZip, pyWalrus, pyUnpacking, pyFstrings, pyDefaultdict, pyCounter, pyAnyAll];
const aws = [awsEc2, awsS3, awsLambda, awsDynamodb, awsSqs, awsSns, awsCloudfront, awsIam, awsRds, awsEcs];
const networking = [netIp, netTcpUdp, netDns, netPorts, netHttp, netLatency, netLoadBalancer, netCdn, netFirewall, netCors];
const twoPointers = [tpTwoSum, tpPalindrome, tpThreeSum, tpContainerWater, tpTrappingRain, tpMoveZeroes, tpSortColors];
const slidingWindow = [swBuySell, swLongestSubstr, swCharReplace, swMinWindow, swMaxSumK, swPermutation, swWindowMax];
const hashMap = [hmTwoSum, hmGroupAnagrams, hmValidAnagram, hmContainsDup, hmTopKFreq, hmLongestConsec, hmEncodeDecode];

export default makeProject({
  // Swap the variable to render a different topic.
  // Append `thumbnails` to generate thumbnail frames, e.g. [...docker, thumbnails]
  // Then update TOPIC in thumbnails.tsx to match.
  scenes: tmux,
});
