import {makeProject} from '@motion-canvas/core';

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

export default makeProject({
  scenes: [
    tmuxCheatsheet,
    // gitInit,
    // gitClone,
    // gitAddCommit,
    // gitPushPull,
    // gitBranch,
    // gitMerge,
    // gitStatusLog,
    // gitStash,
    // gitBisect,
    // gitReflog,
    // gitCherryPick,
    // gitBlame,
    // gitWorktree,
    // thumbnails,
  ],
});
