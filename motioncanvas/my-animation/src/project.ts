import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';
import sample3dMath from './scenes/sample-3d-math?scene';
import thumbnails from './scenes/thumbnails?scene';

// Algebra
import algDiffSquares from './scenes/algebra/alg-diff-squares?scene';
import algSquareDiff from './scenes/algebra/alg-square-diff?scene';
import algSquareSum from './scenes/algebra/alg-square-sum?scene';
const algebra = [algDiffSquares, algSquareDiff, algSquareSum];

// AWS
import awsCloudfront from './scenes/aws/aws-cloudfront?scene';
import awsDynamodb from './scenes/aws/aws-dynamodb?scene';
import awsEc2 from './scenes/aws/aws-ec2?scene';
import awsEcs from './scenes/aws/aws-ecs?scene';
import awsIam from './scenes/aws/aws-iam?scene';
import awsLambda from './scenes/aws/aws-lambda?scene';
import awsRds from './scenes/aws/aws-rds?scene';
import awsS3 from './scenes/aws/aws-s3?scene';
import awsSns from './scenes/aws/aws-sns?scene';
import awsSqs from './scenes/aws/aws-sqs?scene';
const aws = [awsCloudfront, awsDynamodb, awsEc2, awsEcs, awsIam, awsLambda, awsRds, awsS3, awsSns, awsSqs];

// Backtracking
import btComboSum from './scenes/backtracking/bt-combo-sum?scene';
import btLetterCombos from './scenes/backtracking/bt-letter-combos?scene';
import btNQueens from './scenes/backtracking/bt-n-queens?scene';
import btPalindromePart from './scenes/backtracking/bt-palindrome-part?scene';
import btPermutations from './scenes/backtracking/bt-permutations?scene';
import btSubsets from './scenes/backtracking/bt-subsets?scene';
import btWordSearch from './scenes/backtracking/bt-word-search?scene';
const backtracking = [btComboSum, btLetterCombos, btNQueens, btPalindromePart, btPermutations, btSubsets, btWordSearch];

// Binary Search
import bsKokoBananas from './scenes/binary-search/bs-koko-bananas?scene';
import bsMedianTwo from './scenes/binary-search/bs-median-two?scene';
import bsMinRotated from './scenes/binary-search/bs-min-rotated?scene';
import bsSearchMatrix from './scenes/binary-search/bs-search-matrix?scene';
import bsSearchRotated from './scenes/binary-search/bs-search-rotated?scene';
import bsSearchSorted from './scenes/binary-search/bs-search-sorted?scene';
import bsTimeMap from './scenes/binary-search/bs-time-map?scene';
const binarySearch = [bsKokoBananas, bsMedianTwo, bsMinRotated, bsSearchMatrix, bsSearchRotated, bsSearchSorted, bsTimeMap];

// Bit Manipulation
import bmCountBits from './scenes/bit-manipulation/bm-count-bits?scene';
import bmCountingBits from './scenes/bit-manipulation/bm-counting-bits?scene';
import bmMissingNum from './scenes/bit-manipulation/bm-missing-num?scene';
import bmReverseBits from './scenes/bit-manipulation/bm-reverse-bits?scene';
import bmReverseInt from './scenes/bit-manipulation/bm-reverse-int?scene';
import bmSingleNum from './scenes/bit-manipulation/bm-single-num?scene';
import bmSumTwo from './scenes/bit-manipulation/bm-sum-two?scene';
const bitManip = [bmCountBits, bmCountingBits, bmMissingNum, bmReverseBits, bmReverseInt, bmSingleNum, bmSumTwo];

// Brain
import brainAnchoring from './scenes/brain/brain-anchoring?scene';
import brainAttention from './scenes/brain/brain-attention?scene';
import brainChangeBlind from './scenes/brain/brain-change-blind?scene';
import brainChoice from './scenes/brain/brain-choice?scene';
import brainConfirmation from './scenes/brain/brain-confirmation?scene';
import brainDunningKruger from './scenes/brain/brain-dunning-kruger?scene';
import brainFrequency from './scenes/brain/brain-frequency?scene';
import brainMcgurk from './scenes/brain/brain-mcgurk?scene';
import brainPriming from './scenes/brain/brain-priming?scene';
import brainStroop from './scenes/brain/brain-stroop?scene';
const brain = [brainAnchoring, brainAttention, brainChangeBlind, brainChoice, brainConfirmation, brainDunningKruger, brainFrequency, brainMcgurk, brainPriming, brainStroop];

// CSS
import cssAspect from './scenes/css/css-aspect?scene';
import cssClamp from './scenes/css/css-clamp?scene';
import cssContainer from './scenes/css/css-container?scene';
import cssFlexbox from './scenes/css/css-flexbox?scene';
import cssGrid from './scenes/css/css-grid?scene';
import cssHas from './scenes/css/css-has?scene';
import cssLayer from './scenes/css/css-layer?scene';
import cssNesting from './scenes/css/css-nesting?scene';
import cssScrollSnap from './scenes/css/css-scroll-snap?scene';
import cssViewTransitions from './scenes/css/css-view-transitions?scene';
const css = [cssAspect, cssClamp, cssContainer, cssFlexbox, cssGrid, cssHas, cssLayer, cssNesting, cssScrollSnap, cssViewTransitions];

// Docker
import dockerBuild from './scenes/docker/docker-build?scene';
import dockerCompose from './scenes/docker/docker-compose?scene';
import dockerExec from './scenes/docker/docker-exec?scene';
import dockerImages from './scenes/docker/docker-images?scene';
import dockerLogs from './scenes/docker/docker-logs?scene';
import dockerPs from './scenes/docker/docker-ps?scene';
import dockerRm from './scenes/docker/docker-rm?scene';
import dockerRun from './scenes/docker/docker-run?scene';
import dockerStop from './scenes/docker/docker-stop?scene';
import dockerVolumes from './scenes/docker/docker-volumes?scene';
const docker = [dockerBuild, dockerCompose, dockerExec, dockerImages, dockerLogs, dockerPs, dockerRm, dockerRun, dockerStop, dockerVolumes];

// DP 1D
import dpClimbStairs from './scenes/dp-1d/dp-climb-stairs?scene';
import dpCoinChange from './scenes/dp-1d/dp-coin-change?scene';
import dpDecodeWays from './scenes/dp-1d/dp-decode-ways?scene';
import dpHouseRobber from './scenes/dp-1d/dp-house-robber?scene';
import dpLis from './scenes/dp-1d/dp-lis?scene';
import dpMaxProduct from './scenes/dp-1d/dp-max-product?scene';
import dpWordBreak from './scenes/dp-1d/dp-word-break?scene';
const dp1d = [dpClimbStairs, dpCoinChange, dpDecodeWays, dpHouseRobber, dpLis, dpMaxProduct, dpWordBreak];

// DP 2D
import d2BurstBalloons from './scenes/dp-2d/d2-burst-balloons?scene';
import d2EditDist from './scenes/dp-2d/d2-edit-dist?scene';
import d2Interleave from './scenes/dp-2d/d2-interleave?scene';
import d2Lcs from './scenes/dp-2d/d2-lcs?scene';
import d2LongestPalin from './scenes/dp-2d/d2-longest-palin?scene';
import d2TargetSum from './scenes/dp-2d/d2-target-sum?scene';
import d2UniquePaths from './scenes/dp-2d/d2-unique-paths?scene';
const dp2d = [d2BurstBalloons, d2EditDist, d2Interleave, d2Lcs, d2LongestPalin, d2TargetSum, d2UniquePaths];

// Geometry
import geoCircleArea from './scenes/geometry/geo-circle-area?scene';
import geoEuler from './scenes/geometry/geo-euler?scene';
import geoExteriorAngles from './scenes/geometry/geo-exterior-angles?scene';
import geoGoldenRatio from './scenes/geometry/geo-golden-ratio?scene';
import geoInscribedAngle from './scenes/geometry/geo-inscribed-angle?scene';
import geoInteriorSum from './scenes/geometry/geo-interior-sum?scene';
import geoPi from './scenes/geometry/geo-pi?scene';
import geoPythagoras from './scenes/geometry/geo-pythagoras?scene';
import geoTriangle180 from './scenes/geometry/geo-triangle-180?scene';
import geoTriangleArea from './scenes/geometry/geo-triangle-area?scene';
const geometry = [geoPi, geoTriangle180, geoEuler, geoPythagoras, geoCircleArea, geoGoldenRatio, geoExteriorAngles, geoInscribedAngle, geoInteriorSum, geoTriangleArea];

// Git
import gitAddCommit from './scenes/git/git-add-commit?scene';
import gitBisect from './scenes/git/git-bisect?scene';
import gitBlame from './scenes/git/git-blame?scene';
import gitBranch from './scenes/git/git-branch?scene';
import gitCherryPick from './scenes/git/git-cherry-pick?scene';
import gitClone from './scenes/git/git-clone?scene';
import gitInit from './scenes/git/git-init?scene';
import gitMerge from './scenes/git/git-merge?scene';
import gitPushPull from './scenes/git/git-push-pull?scene';
import gitReflog from './scenes/git/git-reflog?scene';
import gitStash from './scenes/git/git-stash?scene';
import gitStatusLog from './scenes/git/git-status-log?scene';
import gitWorktree from './scenes/git/git-worktree?scene';
const git = [gitAddCommit, gitBisect, gitBlame, gitBranch, gitCherryPick, gitClone, gitInit, gitMerge, gitPushPull, gitReflog, gitStash, gitStatusLog, gitWorktree];

// Greedy
import grGasStation from './scenes/greedy/gr-gas-station?scene';
import grHandStraights from './scenes/greedy/gr-hand-straights?scene';
import grJumpGame from './scenes/greedy/gr-jump-game?scene';
import grJumpGame2 from './scenes/greedy/gr-jump-game2?scene';
import grMaxSubarray from './scenes/greedy/gr-max-subarray?scene';
import grMergeTriplets from './scenes/greedy/gr-merge-triplets?scene';
import grPartitionLabels from './scenes/greedy/gr-partition-labels?scene';
const greedy = [grGasStation, grHandStraights, grJumpGame, grJumpGame2, grMaxSubarray, grMergeTriplets, grPartitionLabels];

// HashMap
import hmContainsDup from './scenes/hashmap/hm-contains-dup?scene';
import hmEncodeDecode from './scenes/hashmap/hm-encode-decode?scene';
import hmGroupAnagrams from './scenes/hashmap/hm-group-anagrams?scene';
import hmLongestConsec from './scenes/hashmap/hm-longest-consec?scene';
import hmTopKFreq from './scenes/hashmap/hm-top-k-freq?scene';
import hmTwoSum from './scenes/hashmap/hm-two-sum?scene';
import hmValidAnagram from './scenes/hashmap/hm-valid-anagram?scene';
const hashMap = [hmContainsDup, hmEncodeDecode, hmGroupAnagrams, hmLongestConsec, hmTopKFreq, hmTwoSum, hmValidAnagram];

// Heap
import hpFindMedian from './scenes/heap/hp-find-median?scene';
import hpKClosest from './scenes/heap/hp-k-closest?scene';
import hpKthLargest from './scenes/heap/hp-kth-largest?scene';
import hpLastStone from './scenes/heap/hp-last-stone?scene';
import hpMergeK from './scenes/heap/hp-merge-k?scene';
import hpTaskSched from './scenes/heap/hp-task-sched?scene';
import hpTopKFreq from './scenes/heap/hp-top-k-freq?scene';
const heap = [hpFindMedian, hpKClosest, hpKthLargest, hpLastStone, hpMergeK, hpTaskSched, hpTopKFreq];

// HTTP
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
const http = [http200, http201, http301, http400, http401, http403, http404, http429, http500, http503];

// illusions
import illusionChecker from './scenes/illusions/illusion-checker?scene';
import illusionEbbinghaus from './scenes/illusions/illusion-ebbinghaus?scene';
import illusionIntro from './scenes/illusions/illusion-intro?scene';
import illusionMuller from './scenes/illusions/illusion-muller?scene';
import illusionOutro from './scenes/illusions/illusion-outro?scene';
const illusions = [illusionIntro, illusionChecker, illusionEbbinghaus, illusionMuller, illusionOutro];

// Memory Tricks
import memoryThumbnail from './scenes/memory/memory-thumbnail?scene';
import memoryChunking from './scenes/memory/memory-chunking?scene';
import memoryLoci from './scenes/memory/memory-loci?scene';
import memorySpaced from './scenes/memory/memory-spaced?scene';
import memoryAcronyms from './scenes/memory/memory-acronyms?scene';
import memoryStory from './scenes/memory/memory-story?scene';
import memoryVisual from './scenes/memory/memory-visual?scene';
import memoryRecall from './scenes/memory/memory-recall?scene';
import memorySleep from './scenes/memory/memory-sleep?scene';
import memoryTeach from './scenes/memory/memory-teach?scene';
import memoryDual from './scenes/memory/memory-dual?scene';
import memoryOutro from './scenes/memory/memory-outro?scene';
const memory = [memoryThumbnail, memoryChunking, memoryLoci, memorySpaced, memoryAcronyms, memoryStory, memoryVisual, memoryRecall, memorySleep, memoryTeach, memoryDual, memoryOutro];

// Sorting Algorithms
import sortThumbnail from './scenes/sorting/sort-thumbnail?scene';
import sortBubble from './scenes/sorting/sort-bubble?scene';
import sortSelection from './scenes/sorting/sort-selection?scene';
import sortInsertion from './scenes/sorting/sort-insertion?scene';
import sortMerge from './scenes/sorting/sort-merge?scene';
import sortQuick from './scenes/sorting/sort-quick?scene';
import sortCompare from './scenes/sorting/sort-compare?scene';
import sortOutro from './scenes/sorting/sort-outro?scene';
const sorting = [sortThumbnail, sortBubble, sortSelection, sortInsertion, sortMerge, sortQuick, sortCompare, sortOutro];

// Google Tricks
import googleThumbnail from './scenes/google/google-thumbnail?scene';
import googleExact from './scenes/google/google-exact?scene';
import googleExclude from './scenes/google/google-exclude?scene';
import googleSite from './scenes/google/google-site?scene';
import googleFiletype from './scenes/google/google-filetype?scene';
import googleTime from './scenes/google/google-time?scene';
import googleOr from './scenes/google/google-or?scene';
import googleWildcard from './scenes/google/google-wildcard?scene';
import googleIntitle from './scenes/google/google-intitle?scene';
import googleRelated from './scenes/google/google-related?scene';
import googleCombo from './scenes/google/google-combo?scene';
import googleOutro from './scenes/google/google-outro?scene';
const google = [googleThumbnail, googleExact, googleExclude, googleSite, googleFiletype, googleTime, googleOr, googleWildcard, googleIntitle, googleRelated, googleCombo, googleOutro];

// Evolution of Programming Languages
import evoThumbnail from './scenes/prog-evolution/evo-thumbnail?scene';
import evo1950s from './scenes/prog-evolution/evo-1950s?scene';
import evo1970s from './scenes/prog-evolution/evo-1970s?scene';
import evo1990s from './scenes/prog-evolution/evo-1990s?scene';
import evo2000s from './scenes/prog-evolution/evo-2000s?scene';
import evo2010s from './scenes/prog-evolution/evo-2010s?scene';
import evoOutro from './scenes/prog-evolution/evo-outro?scene';
const progEvolution = [evoThumbnail, evo1950s, evo1970s, evo1990s, evo2000s, evo2010s, evoOutro];

// Apollo vs Phone
import apolloThumbnail from './scenes/apollo/apollo-thumbnail?scene';
import apolloRam from './scenes/apollo/apollo-ram?scene';
import apolloCpu from './scenes/apollo/apollo-cpu?scene';
import apolloStorage from './scenes/apollo/apollo-storage?scene';
import apolloWeight from './scenes/apollo/apollo-weight?scene';
import apolloPower from './scenes/apollo/apollo-power?scene';
import apolloPrice from './scenes/apollo/apollo-price?scene';
import apolloSummary from './scenes/apollo/apollo-summary?scene';
import apolloOutro from './scenes/apollo/apollo-outro?scene';
const apollo = [apolloThumbnail, apolloRam, apolloCpu, apolloStorage, apolloWeight, apolloPower, apolloPrice, apolloSummary, apolloOutro];

// 1 Second on the Internet
import osThumbnail from './scenes/one-second/os-thumbnail?scene';
import osGoogle from './scenes/one-second/os-google?scene';
import osEmail from './scenes/one-second/os-email?scene';
import osYoutube from './scenes/one-second/os-youtube?scene';
import osAmazon from './scenes/one-second/os-amazon?scene';
import osTiktok from './scenes/one-second/os-tiktok?scene';
import osWhatsapp from './scenes/one-second/os-whatsapp?scene';
import osInstagram from './scenes/one-second/os-instagram?scene';
import osData from './scenes/one-second/os-data?scene';
import osOutro from './scenes/one-second/os-outro?scene';
const oneSecond = [osThumbnail, osGoogle, osEmail, osYoutube, osAmazon, osTiktok, osWhatsapp, osInstagram, osData, osOutro];

// CEO Pay Per Second
import ceoThumbnail from './scenes/ceo-pay/ceo-thumbnail?scene';
import ceoCook from './scenes/ceo-pay/ceo-cook?scene';
import ceoPichai from './scenes/ceo-pay/ceo-pichai?scene';
import ceoJassy from './scenes/ceo-pay/ceo-jassy?scene';
import ceoNadella from './scenes/ceo-pay/ceo-nadella?scene';
import ceoTan from './scenes/ceo-pay/ceo-tan?scene';
import ceoWorker from './scenes/ceo-pay/ceo-worker?scene';
import ceoRace from './scenes/ceo-pay/ceo-race?scene';
import ceoOutro from './scenes/ceo-pay/ceo-outro?scene';
const ceoPay = [ceoThumbnail, ceoCook, ceoPichai, ceoJassy, ceoNadella, ceoTan, ceoWorker, ceoRace, ceoOutro];

// Intervals
import ivInsert from './scenes/intervals/iv-insert?scene';
import ivIntersections from './scenes/intervals/iv-intersections?scene';
import ivMeetingRooms from './scenes/intervals/iv-meeting-rooms?scene';
import ivMeetingRooms2 from './scenes/intervals/iv-meeting-rooms2?scene';
import ivMerge from './scenes/intervals/iv-merge?scene';
import ivMinArrows from './scenes/intervals/iv-min-arrows?scene';
import ivNonOverlap from './scenes/intervals/iv-non-overlap?scene';
const intervals = [ivInsert, ivIntersections, ivMeetingRooms, ivMeetingRooms2, ivMerge, ivMinArrows, ivNonOverlap];

// Kubernetes
import k8sConfigmaps from './scenes/kubernetes/k8s-configmaps?scene';
import k8sDeployments from './scenes/kubernetes/k8s-deployments?scene';
import k8sHelm from './scenes/kubernetes/k8s-helm?scene';
import k8sHpa from './scenes/kubernetes/k8s-hpa?scene';
import k8sIngress from './scenes/kubernetes/k8s-ingress?scene';
import k8sNamespaces from './scenes/kubernetes/k8s-namespaces?scene';
import k8sPods from './scenes/kubernetes/k8s-pods?scene';
import k8sSecrets from './scenes/kubernetes/k8s-secrets?scene';
import k8sServices from './scenes/kubernetes/k8s-services?scene';
import k8sVolumes from './scenes/kubernetes/k8s-volumes?scene';
const kubernetes = [k8sConfigmaps, k8sDeployments, k8sHelm, k8sHpa, k8sIngress, k8sNamespaces, k8sPods, k8sSecrets, k8sServices, k8sVolumes];

// Linked List
import llAddTwo from './scenes/linked-list/ll-add-two?scene';
import llCopyRandom from './scenes/linked-list/ll-copy-random?scene';
import llHasCycle from './scenes/linked-list/ll-has-cycle?scene';
import llMergeTwo from './scenes/linked-list/ll-merge-two?scene';
import llRemoveNth from './scenes/linked-list/ll-remove-nth?scene';
import llReorder from './scenes/linked-list/ll-reorder?scene';
import llReverse from './scenes/linked-list/ll-reverse?scene';
const linkedList = [llAddTwo, llCopyRandom, llHasCycle, llMergeTwo, llRemoveNth, llReorder, llReverse];

// Linux
import linuxAwk from './scenes/linux/linux-awk?scene';
import linuxChmod from './scenes/linux/linux-chmod?scene';
import linuxCurl from './scenes/linux/linux-curl?scene';
import linuxFind from './scenes/linux/linux-find?scene';
import linuxGrep from './scenes/linux/linux-grep?scene';
import linuxLn from './scenes/linux/linux-ln?scene';
import linuxSed from './scenes/linux/linux-sed?scene';
import linuxSsh from './scenes/linux/linux-ssh?scene';
import linuxTar from './scenes/linux/linux-tar?scene';
import linuxXargs from './scenes/linux/linux-xargs?scene';
const linux = [linuxAwk, linuxChmod, linuxCurl, linuxFind, linuxGrep, linuxLn, linuxSed, linuxSsh, linuxTar, linuxXargs];

// Networking
import netCdn from './scenes/networking/net-cdn?scene';
import netCors from './scenes/networking/net-cors?scene';
import netDns from './scenes/networking/net-dns?scene';
import netFirewall from './scenes/networking/net-firewall?scene';
import netHttp from './scenes/networking/net-http?scene';
import netIp from './scenes/networking/net-ip?scene';
import netLatency from './scenes/networking/net-latency?scene';
import netLoadBalancer from './scenes/networking/net-load-balancer?scene';
import netPorts from './scenes/networking/net-ports?scene';
import netTcpUdp from './scenes/networking/net-tcp-udp?scene';
const networking = [netCdn, netCors, netDns, netFirewall, netHttp, netIp, netLatency, netLoadBalancer, netPorts, netTcpUdp];

// Paradoxes
import pxAchilles from './scenes/paradoxes/px-achilles?scene';
import pxBootstrap from './scenes/paradoxes/px-bootstrap?scene';
import pxCta from './scenes/paradoxes/px-cta?scene';
import pxFermi from './scenes/paradoxes/px-fermi?scene';
import pxGrandfather from './scenes/paradoxes/px-grandfather?scene';
import pxShipTheseus from './scenes/paradoxes/px-ship-theseus?scene';
import pxSorites from './scenes/paradoxes/px-sorites?scene';
import pxTwin from './scenes/paradoxes/px-twin?scene';
import pxZenoArrow from './scenes/paradoxes/px-zeno-arrow?scene';
const paradoxes = [pxShipTheseus, pxZenoArrow, pxBootstrap, pxGrandfather, pxFermi, pxTwin, pxSorites, pxAchilles, pxCta];

// Probability
import probBayes from './scenes/probability/prob-bayes?scene';
import probBellCurve from './scenes/probability/prob-bell-curve?scene';
import probBirthday from './scenes/probability/prob-birthday?scene';
import probCombPerm from './scenes/probability/prob-comb-perm?scene';
import probConditional from './scenes/probability/prob-conditional?scene';
import probExpectedValue from './scenes/probability/prob-expected-value?scene';
import probGamblers from './scenes/probability/prob-gamblers?scene';
import probIndependent from './scenes/probability/prob-independent?scene';
import probLargeNumbers from './scenes/probability/prob-large-numbers?scene';
import probMontyHall from './scenes/probability/prob-monty-hall?scene';
const probability = [probBayes, probBellCurve, probBirthday, probCombPerm, probConditional, probExpectedValue, probGamblers, probIndependent, probLargeNumbers, probMontyHall];

// Python
import pyAnyAll from './scenes/python/py-any-all?scene';
import pyCounter from './scenes/python/py-counter?scene';
import pyDefaultdict from './scenes/python/py-defaultdict?scene';
import pyDictComp from './scenes/python/py-dict-comp?scene';
import pyEnumerate from './scenes/python/py-enumerate?scene';
import pyFstrings from './scenes/python/py-fstrings?scene';
import pyListComp from './scenes/python/py-list-comp?scene';
import pyUnpacking from './scenes/python/py-unpacking?scene';
import pyWalrus from './scenes/python/py-walrus?scene';
import pyZip from './scenes/python/py-zip?scene';
const python = [pyAnyAll, pyCounter, pyDefaultdict, pyDictComp, pyEnumerate, pyFstrings, pyListComp, pyUnpacking, pyWalrus, pyZip];

// Regex
import regexAlternation from './scenes/regex/regex-alternation?scene';
import regexAnchors from './scenes/regex/regex-anchors?scene';
import regexCharClass from './scenes/regex/regex-char-class?scene';
import regexGreedy from './scenes/regex/regex-greedy?scene';
import regexGroups from './scenes/regex/regex-groups?scene';
import regexLiterals from './scenes/regex/regex-literals?scene';
import regexLookahead from './scenes/regex/regex-lookahead?scene';
import regexLookbehind from './scenes/regex/regex-lookbehind?scene';
import regexPatterns from './scenes/regex/regex-patterns?scene';
import regexQuantifiers from './scenes/regex/regex-quantifiers?scene';
const regex = [regexAlternation, regexAnchors, regexCharClass, regexGreedy, regexGroups, regexLiterals, regexLookahead, regexLookbehind, regexPatterns, regexQuantifiers];

// Sliding Window
import swBuySell from './scenes/sliding-window/sw-buy-sell?scene';
import swCharReplace from './scenes/sliding-window/sw-char-replace?scene';
import swLongestSubstr from './scenes/sliding-window/sw-longest-substr?scene';
import swMaxSumK from './scenes/sliding-window/sw-max-sum-k?scene';
import swMinWindow from './scenes/sliding-window/sw-min-window?scene';
import swPermutation from './scenes/sliding-window/sw-permutation?scene';
import swWindowMax from './scenes/sliding-window/sw-window-max?scene';
const slidingWindow = [swBuySell, swCharReplace, swLongestSubstr, swMaxSumK, swMinWindow, swPermutation, swWindowMax];

// SQL
import sqlCte from './scenes/sql/sql-cte?scene';
import sqlGroupBy from './scenes/sql/sql-group-by?scene';
import sqlHaving from './scenes/sql/sql-having?scene';
import sqlIndex from './scenes/sql/sql-index?scene';
import sqlJoin from './scenes/sql/sql-join?scene';
import sqlSelect from './scenes/sql/sql-select?scene';
import sqlSubquery from './scenes/sql/sql-subquery?scene';
import sqlUnion from './scenes/sql/sql-union?scene';
import sqlWhere from './scenes/sql/sql-where?scene';
import sqlWindow from './scenes/sql/sql-window?scene';
const sql = [sqlCte, sqlGroupBy, sqlHaving, sqlIndex, sqlJoin, sqlSelect, sqlSubquery, sqlUnion, sqlWhere, sqlWindow];

// Stack
import stCarFleet from './scenes/stack/st-car-fleet?scene';
import stDailyTemps from './scenes/stack/st-daily-temps?scene';
import stEvalRpn from './scenes/stack/st-eval-rpn?scene';
import stGenParens from './scenes/stack/st-gen-parens?scene';
import stLargestRect from './scenes/stack/st-largest-rect?scene';
import stMinStack from './scenes/stack/st-min-stack?scene';
import stValidParens from './scenes/stack/st-valid-parens?scene';
const stack = [stCarFleet, stDailyTemps, stEvalRpn, stGenParens, stLargestRect, stMinStack, stValidParens];

// tmux
import tmuxCheatsheet from './scenes/tmux/tmux-cheatsheet?scene';
const tmux = [tmuxCheatsheet];

// Trees
import trInvert from './scenes/trees/tr-invert?scene';
import trLcaBst from './scenes/trees/tr-lca-bst?scene';
import trLevelOrder from './scenes/trees/tr-level-order?scene';
import trMaxDepth from './scenes/trees/tr-max-depth?scene';
import trSameTree from './scenes/trees/tr-same-tree?scene';
import trSubtree from './scenes/trees/tr-subtree?scene';
import trValidBst from './scenes/trees/tr-valid-bst?scene';
const trees = [trInvert, trLcaBst, trLevelOrder, trMaxDepth, trSameTree, trSubtree, trValidBst];

// Trie
import tiAddSearch from './scenes/trie/ti-add-search?scene';
import tiImplement from './scenes/trie/ti-implement?scene';
import tiWordSearch2 from './scenes/trie/ti-word-search2?scene';
const trie = [tiAddSearch, tiImplement, tiWordSearch2];

// Two Pointers
import tpContainerWater from './scenes/two-pointers/tp-container-water?scene';
import tpMoveZeroes from './scenes/two-pointers/tp-move-zeroes?scene';
import tpPalindrome from './scenes/two-pointers/tp-palindrome?scene';
import tpSortColors from './scenes/two-pointers/tp-sort-colors?scene';
import tpThreeSum from './scenes/two-pointers/tp-three-sum?scene';
import tpTrappingRain from './scenes/two-pointers/tp-trapping-rain?scene';
import tpTwoSum from './scenes/two-pointers/tp-two-sum?scene';
const twoPointers = [tpContainerWater, tpMoveZeroes, tpPalindrome, tpSortColors, tpThreeSum, tpTrappingRain, tpTwoSum];

// Vim
import vimCiw from './scenes/vim/vim-ciw?scene';
import vimDd from './scenes/vim/vim-dd?scene';
import vimDot from './scenes/vim/vim-dot?scene';
import vimMacros from './scenes/vim/vim-macros?scene';
import vimModes from './scenes/vim/vim-modes?scene';
import vimSaveQuit from './scenes/vim/vim-save-quit?scene';
import vimSearch from './scenes/vim/vim-search?scene';
import vimSplits from './scenes/vim/vim-splits?scene';
import vimSubstitute from './scenes/vim/vim-substitute?scene';
import vimYankPaste from './scenes/vim/vim-yank-paste?scene';
const vim = [vimCiw, vimDd, vimDot, vimMacros, vimModes, vimSaveQuit, vimSearch, vimSplits, vimSubstitute, vimYankPaste];

export default makeProject({
  scenes: ceoPay,
});
