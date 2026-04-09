import {makeProject} from '@motion-canvas/core';

// Git
import gitInit from './scenes/git/git-init?scene';
import gitClone from './scenes/git/git-clone?scene';
import gitAddCommit from './scenes/git/git-add-commit?scene';
import gitPushPull from './scenes/git/git-push-pull?scene';
import gitBranch from './scenes/git/git-branch?scene';
import gitMerge from './scenes/git/git-merge?scene';
import gitStatusLog from './scenes/git/git-status-log?scene';
import gitStash from './scenes/git/git-stash?scene';
import gitBisect from './scenes/git/git-bisect?scene';
import gitReflog from './scenes/git/git-reflog?scene';
import gitCherryPick from './scenes/git/git-cherry-pick?scene';
import gitBlame from './scenes/git/git-blame?scene';
import gitWorktree from './scenes/git/git-worktree?scene';
import thumbnails from './scenes/thumbnails?scene';
import tmuxCheatsheet from './scenes/tmux/tmux-cheatsheet?scene';

// Docker
import dockerRun from './scenes/docker/docker-run?scene';
import dockerBuild from './scenes/docker/docker-build?scene';
import dockerPs from './scenes/docker/docker-ps?scene';
import dockerExec from './scenes/docker/docker-exec?scene';
import dockerLogs from './scenes/docker/docker-logs?scene';
import dockerStop from './scenes/docker/docker-stop?scene';
import dockerRm from './scenes/docker/docker-rm?scene';
import dockerImages from './scenes/docker/docker-images?scene';
import dockerVolumes from './scenes/docker/docker-volumes?scene';
import dockerCompose from './scenes/docker/docker-compose?scene';

// Linux
import linuxGrep from './scenes/linux/linux-grep?scene';
import linuxFind from './scenes/linux/linux-find?scene';
import linuxAwk from './scenes/linux/linux-awk?scene';
import linuxSed from './scenes/linux/linux-sed?scene';
import linuxXargs from './scenes/linux/linux-xargs?scene';
import linuxCurl from './scenes/linux/linux-curl?scene';
import linuxChmod from './scenes/linux/linux-chmod?scene';
import linuxLn from './scenes/linux/linux-ln?scene';
import linuxTar from './scenes/linux/linux-tar?scene';
import linuxSsh from './scenes/linux/linux-ssh?scene';

// Vim
import vimModes from './scenes/vim/vim-modes?scene';
import vimSaveQuit from './scenes/vim/vim-save-quit?scene';
import vimSearch from './scenes/vim/vim-search?scene';
import vimDd from './scenes/vim/vim-dd?scene';
import vimYankPaste from './scenes/vim/vim-yank-paste?scene';
import vimCiw from './scenes/vim/vim-ciw?scene';
import vimSplits from './scenes/vim/vim-splits?scene';
import vimMacros from './scenes/vim/vim-macros?scene';
import vimSubstitute from './scenes/vim/vim-substitute?scene';
import vimDot from './scenes/vim/vim-dot?scene';

// SQL
import sqlSelect from './scenes/sql/sql-select?scene';
import sqlWhere from './scenes/sql/sql-where?scene';
import sqlJoin from './scenes/sql/sql-join?scene';
import sqlGroupBy from './scenes/sql/sql-group-by?scene';
import sqlHaving from './scenes/sql/sql-having?scene';
import sqlSubquery from './scenes/sql/sql-subquery?scene';
import sqlIndex from './scenes/sql/sql-index?scene';
import sqlUnion from './scenes/sql/sql-union?scene';
import sqlWindow from './scenes/sql/sql-window?scene';
import sqlCte from './scenes/sql/sql-cte?scene';

// Regex
import regexLiterals from './scenes/regex/regex-literals?scene';
import regexCharClass from './scenes/regex/regex-char-class?scene';
import regexQuantifiers from './scenes/regex/regex-quantifiers?scene';
import regexAnchors from './scenes/regex/regex-anchors?scene';
import regexGroups from './scenes/regex/regex-groups?scene';
import regexAlternation from './scenes/regex/regex-alternation?scene';
import regexLookahead from './scenes/regex/regex-lookahead?scene';
import regexLookbehind from './scenes/regex/regex-lookbehind?scene';
import regexGreedy from './scenes/regex/regex-greedy?scene';
import regexPatterns from './scenes/regex/regex-patterns?scene';

// HTTP Status Codes
import http200 from './scenes/http/http-200?scene';
import http201 from './scenes/http/http-201?scene';
import http301 from './scenes/http/http-301?scene';
import http400 from './scenes/http/http-400?scene';
import http401 from './scenes/http/http-401?scene';
import http403 from './scenes/http/http-403?scene';
import http404 from './scenes/http/http-404?scene';
import http429 from './scenes/http/http-429?scene';
import http500 from './scenes/http/http-500?scene';
import http503 from './scenes/http/http-503?scene';

// CSS
import cssFlexbox from './scenes/css/css-flexbox?scene';
import cssGrid from './scenes/css/css-grid?scene';
import cssClamp from './scenes/css/css-clamp?scene';
import cssHas from './scenes/css/css-has?scene';
import cssContainer from './scenes/css/css-container?scene';
import cssAspect from './scenes/css/css-aspect?scene';
import cssScrollSnap from './scenes/css/css-scroll-snap?scene';
import cssLayer from './scenes/css/css-layer?scene';
import cssNesting from './scenes/css/css-nesting?scene';
import cssViewTransitions from './scenes/css/css-view-transitions?scene';

// Python
import pyListComp from './scenes/python/py-list-comp?scene';
import pyDictComp from './scenes/python/py-dict-comp?scene';
import pyEnumerate from './scenes/python/py-enumerate?scene';
import pyZip from './scenes/python/py-zip?scene';
import pyWalrus from './scenes/python/py-walrus?scene';
import pyUnpacking from './scenes/python/py-unpacking?scene';
import pyFstrings from './scenes/python/py-fstrings?scene';
import pyDefaultdict from './scenes/python/py-defaultdict?scene';
import pyCounter from './scenes/python/py-counter?scene';
import pyAnyAll from './scenes/python/py-any-all?scene';

// AWS
import awsEc2 from './scenes/aws/aws-ec2?scene';
import awsS3 from './scenes/aws/aws-s3?scene';
import awsLambda from './scenes/aws/aws-lambda?scene';
import awsDynamodb from './scenes/aws/aws-dynamodb?scene';
import awsSqs from './scenes/aws/aws-sqs?scene';
import awsSns from './scenes/aws/aws-sns?scene';
import awsCloudfront from './scenes/aws/aws-cloudfront?scene';
import awsIam from './scenes/aws/aws-iam?scene';
import awsRds from './scenes/aws/aws-rds?scene';
import awsEcs from './scenes/aws/aws-ecs?scene';

// Networking
import netIp from './scenes/networking/net-ip?scene';
import netTcpUdp from './scenes/networking/net-tcp-udp?scene';
import netDns from './scenes/networking/net-dns?scene';
import netPorts from './scenes/networking/net-ports?scene';
import netHttp from './scenes/networking/net-http?scene';
import netLatency from './scenes/networking/net-latency?scene';
import netLoadBalancer from './scenes/networking/net-load-balancer?scene';
import netCdn from './scenes/networking/net-cdn?scene';
import netFirewall from './scenes/networking/net-firewall?scene';
import netCors from './scenes/networking/net-cors?scene';

// Kubernetes
import k8sPods from './scenes/kubernetes/k8s-pods?scene';
import k8sDeployments from './scenes/kubernetes/k8s-deployments?scene';
import k8sServices from './scenes/kubernetes/k8s-services?scene';
import k8sIngress from './scenes/kubernetes/k8s-ingress?scene';
import k8sConfigmaps from './scenes/kubernetes/k8s-configmaps?scene';
import k8sSecrets from './scenes/kubernetes/k8s-secrets?scene';
import k8sNamespaces from './scenes/kubernetes/k8s-namespaces?scene';
import k8sVolumes from './scenes/kubernetes/k8s-volumes?scene';
import k8sHpa from './scenes/kubernetes/k8s-hpa?scene';
import k8sHelm from './scenes/kubernetes/k8s-helm?scene';

// LeetCode: Two Pointers
import tpTwoSum from './scenes/two-pointers/tp-two-sum?scene';
import tpPalindrome from './scenes/two-pointers/tp-palindrome?scene';
import tpThreeSum from './scenes/two-pointers/tp-three-sum?scene';
import tpContainerWater from './scenes/two-pointers/tp-container-water?scene';
import tpTrappingRain from './scenes/two-pointers/tp-trapping-rain?scene';
import tpMoveZeroes from './scenes/two-pointers/tp-move-zeroes?scene';
import tpSortColors from './scenes/two-pointers/tp-sort-colors?scene';

// LeetCode: Sliding Window
import swBuySell from './scenes/sliding-window/sw-buy-sell?scene';
import swLongestSubstr from './scenes/sliding-window/sw-longest-substr?scene';
import swCharReplace from './scenes/sliding-window/sw-char-replace?scene';
import swMinWindow from './scenes/sliding-window/sw-min-window?scene';
import swMaxSumK from './scenes/sliding-window/sw-max-sum-k?scene';
import swPermutation from './scenes/sliding-window/sw-permutation?scene';
import swWindowMax from './scenes/sliding-window/sw-window-max?scene';

// LeetCode: HashMap / HashSet
import hmTwoSum from './scenes/hashmap/hm-two-sum?scene';
import hmGroupAnagrams from './scenes/hashmap/hm-group-anagrams?scene';
import hmValidAnagram from './scenes/hashmap/hm-valid-anagram?scene';
import hmContainsDup from './scenes/hashmap/hm-contains-dup?scene';
import hmTopKFreq from './scenes/hashmap/hm-top-k-freq?scene';
import hmLongestConsec from './scenes/hashmap/hm-longest-consec?scene';
import hmEncodeDecode from './scenes/hashmap/hm-encode-decode?scene';

// LeetCode: Binary Search
import bsSearchSorted from './scenes/binary-search/bs-search-sorted?scene';
import bsSearchMatrix from './scenes/binary-search/bs-search-matrix?scene';
import bsKokoBananas from './scenes/binary-search/bs-koko-bananas?scene';
import bsMinRotated from './scenes/binary-search/bs-min-rotated?scene';
import bsSearchRotated from './scenes/binary-search/bs-search-rotated?scene';
import bsTimeMap from './scenes/binary-search/bs-time-map?scene';
import bsMedianTwo from './scenes/binary-search/bs-median-two?scene';

// LeetCode: Linked List
import llReverse from './scenes/linked-list/ll-reverse?scene';
import llMergeTwo from './scenes/linked-list/ll-merge-two?scene';
import llReorder from './scenes/linked-list/ll-reorder?scene';
import llRemoveNth from './scenes/linked-list/ll-remove-nth?scene';
import llCopyRandom from './scenes/linked-list/ll-copy-random?scene';
import llAddTwo from './scenes/linked-list/ll-add-two?scene';
import llHasCycle from './scenes/linked-list/ll-has-cycle?scene';

// LeetCode: Trees
import trInvert from './scenes/trees/tr-invert?scene';
import trMaxDepth from './scenes/trees/tr-max-depth?scene';
import trSameTree from './scenes/trees/tr-same-tree?scene';
import trLevelOrder from './scenes/trees/tr-level-order?scene';
import trSubtree from './scenes/trees/tr-subtree?scene';
import trLcaBst from './scenes/trees/tr-lca-bst?scene';
import trValidBst from './scenes/trees/tr-valid-bst?scene';

// LeetCode: Stack
import stValidParens from './scenes/stack/st-valid-parens?scene';
import stMinStack from './scenes/stack/st-min-stack?scene';
import stEvalRpn from './scenes/stack/st-eval-rpn?scene';
import stDailyTemps from './scenes/stack/st-daily-temps?scene';
import stCarFleet from './scenes/stack/st-car-fleet?scene';
import stLargestRect from './scenes/stack/st-largest-rect?scene';
import stGenParens from './scenes/stack/st-gen-parens?scene';

// LeetCode: Heap / Priority Queue
import hpKthLargest from './scenes/heap/hp-kth-largest?scene';
import hpLastStone from './scenes/heap/hp-last-stone?scene';
import hpKClosest from './scenes/heap/hp-k-closest?scene';
import hpTaskSched from './scenes/heap/hp-task-sched?scene';
import hpMergeK from './scenes/heap/hp-merge-k?scene';
import hpFindMedian from './scenes/heap/hp-find-median?scene';
import hpTopKFreq from './scenes/heap/hp-top-k-freq?scene';

// LeetCode: Backtracking
import btSubsets from './scenes/backtracking/bt-subsets?scene';
import btComboSum from './scenes/backtracking/bt-combo-sum?scene';
import btPermutations from './scenes/backtracking/bt-permutations?scene';
import btWordSearch from './scenes/backtracking/bt-word-search?scene';
import btNQueens from './scenes/backtracking/bt-n-queens?scene';
import btPalindromePart from './scenes/backtracking/bt-palindrome-part?scene';
import btLetterCombos from './scenes/backtracking/bt-letter-combos?scene';

// LeetCode: Dynamic Programming 1D
import dpClimbStairs from './scenes/dp-1d/dp-climb-stairs?scene';
import dpHouseRobber from './scenes/dp-1d/dp-house-robber?scene';
import dpCoinChange from './scenes/dp-1d/dp-coin-change?scene';
import dpLis from './scenes/dp-1d/dp-lis?scene';
import dpWordBreak from './scenes/dp-1d/dp-word-break?scene';
import dpDecodeWays from './scenes/dp-1d/dp-decode-ways?scene';
import dpMaxProduct from './scenes/dp-1d/dp-max-product?scene';

// LeetCode: Dynamic Programming 2D
import d2UniquePaths from './scenes/dp-2d/d2-unique-paths?scene';
import d2Lcs from './scenes/dp-2d/d2-lcs?scene';
import d2EditDist from './scenes/dp-2d/d2-edit-dist?scene';
import d2LongestPalin from './scenes/dp-2d/d2-longest-palin?scene';
import d2Interleave from './scenes/dp-2d/d2-interleave?scene';
import d2TargetSum from './scenes/dp-2d/d2-target-sum?scene';
import d2BurstBalloons from './scenes/dp-2d/d2-burst-balloons?scene';

// LeetCode: Greedy
import grMaxSubarray from './scenes/greedy/gr-max-subarray?scene';
import grJumpGame from './scenes/greedy/gr-jump-game?scene';
import grJumpGame2 from './scenes/greedy/gr-jump-game2?scene';
import grGasStation from './scenes/greedy/gr-gas-station?scene';
import grHandStraights from './scenes/greedy/gr-hand-straights?scene';
import grMergeTriplets from './scenes/greedy/gr-merge-triplets?scene';
import grPartitionLabels from './scenes/greedy/gr-partition-labels?scene';

// LeetCode: Trie
import tiImplement from './scenes/trie/ti-implement?scene';
import tiAddSearch from './scenes/trie/ti-add-search?scene';
import tiWordSearch2 from './scenes/trie/ti-word-search2?scene';

// LeetCode: Intervals
import ivInsert from './scenes/intervals/iv-insert?scene';
import ivMerge from './scenes/intervals/iv-merge?scene';
import ivNonOverlap from './scenes/intervals/iv-non-overlap?scene';
import ivMeetingRooms from './scenes/intervals/iv-meeting-rooms?scene';
import ivMeetingRooms2 from './scenes/intervals/iv-meeting-rooms2?scene';
import ivMinArrows from './scenes/intervals/iv-min-arrows?scene';
import ivIntersections from './scenes/intervals/iv-intersections?scene';

// LeetCode: Bit Manipulation
import bmSingleNum from './scenes/bit-manipulation/bm-single-num?scene';
import bmCountBits from './scenes/bit-manipulation/bm-count-bits?scene';
import bmCountingBits from './scenes/bit-manipulation/bm-counting-bits?scene';
import bmReverseBits from './scenes/bit-manipulation/bm-reverse-bits?scene';
import bmMissingNum from './scenes/bit-manipulation/bm-missing-num?scene';
import bmSumTwo from './scenes/bit-manipulation/bm-sum-two?scene';
import bmReverseInt from './scenes/bit-manipulation/bm-reverse-int?scene';

// Brain Tricks
import brainStroop from './scenes/brain/brain-stroop?scene';
import brainAttention from './scenes/brain/brain-attention?scene';
import brainAnchoring from './scenes/brain/brain-anchoring?scene';
import brainMcgurk from './scenes/brain/brain-mcgurk?scene';
import brainPriming from './scenes/brain/brain-priming?scene';
import brainChangeBlind from './scenes/brain/brain-change-blind?scene';
import brainDunningKruger from './scenes/brain/brain-dunning-kruger?scene';
import brainConfirmation from './scenes/brain/brain-confirmation?scene';
import brainChoice from './scenes/brain/brain-choice?scene';
import brainFrequency from './scenes/brain/brain-frequency?scene';

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
const kubernetes = [k8sPods, k8sDeployments, k8sServices, k8sIngress, k8sConfigmaps, k8sSecrets, k8sNamespaces, k8sVolumes, k8sHpa, k8sHelm];
const twoPointers = [tpTwoSum, tpPalindrome, tpThreeSum, tpContainerWater, tpTrappingRain, tpMoveZeroes, tpSortColors];
const slidingWindow = [swBuySell, swLongestSubstr, swCharReplace, swMinWindow, swMaxSumK, swPermutation, swWindowMax];
const hashMap = [hmTwoSum, hmGroupAnagrams, hmValidAnagram, hmContainsDup, hmTopKFreq, hmLongestConsec, hmEncodeDecode];
const binarySearch = [bsSearchSorted, bsSearchMatrix, bsKokoBananas, bsMinRotated, bsSearchRotated, bsTimeMap, bsMedianTwo];
const linkedList = [llReverse, llMergeTwo, llReorder, llRemoveNth, llCopyRandom, llAddTwo, llHasCycle];
const trees = [trInvert, trMaxDepth, trSameTree, trLevelOrder, trSubtree, trLcaBst, trValidBst];
const stack = [stValidParens, stMinStack, stEvalRpn, stDailyTemps, stCarFleet, stLargestRect, stGenParens];
const heap = [hpKthLargest, hpLastStone, hpKClosest, hpTaskSched, hpMergeK, hpFindMedian, hpTopKFreq];
const backtracking = [btSubsets, btComboSum, btPermutations, btWordSearch, btNQueens, btPalindromePart, btLetterCombos];
const dp1d = [dpClimbStairs, dpHouseRobber, dpCoinChange, dpLis, dpWordBreak, dpDecodeWays, dpMaxProduct];
const dp2d = [d2UniquePaths, d2Lcs, d2EditDist, d2LongestPalin, d2Interleave, d2TargetSum, d2BurstBalloons];
const greedy = [grMaxSubarray, grJumpGame, grJumpGame2, grGasStation, grHandStraights, grMergeTriplets, grPartitionLabels];
const trie = [tiImplement, tiAddSearch, tiWordSearch2];
const intervals = [ivInsert, ivMerge, ivNonOverlap, ivMeetingRooms, ivMeetingRooms2, ivMinArrows, ivIntersections];
const bitManip = [bmSingleNum, bmCountBits, bmCountingBits, bmReverseBits, bmMissingNum, bmSumTwo, bmReverseInt];
const brainTricks = [brainStroop, brainAttention, brainAnchoring, brainMcgurk, brainPriming, brainChangeBlind, brainDunningKruger, brainConfirmation, brainChoice, brainFrequency];

export default makeProject({
  // Swap the variable to render a different topic.
  // Append `thumbnails` to generate thumbnail frames, e.g. [...docker, thumbnails]
  // Then update TOPIC in thumbnails.tsx to match.
  scenes: brainTricks,
});
