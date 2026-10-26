#!/usr/bin/env bash
# Type-check and `next build` the COMMITTED tree (HEAD) in a throwaway git
# worktree, so uncommitted work in this checkout can't leak into the result and
# a running dev server's .next isn't touched. Run before every push.
#
#   bash scripts/buildcheck.sh
#
# node_modules is linked from this checkout (a junction on Windows, a symlink
# elsewhere) and unlinked again before the worktree is removed, so removal can
# never delete the real node_modules.
set -euo pipefail
repo="$(git rev-parse --show-toplevel)"
dir="$(mktemp -d 2>/dev/null || mktemp -d -t buildcheck)/tree"
git -C "$repo" worktree add -q --detach "$dir" HEAD

cleanup() {
  if [ -L "$dir/node_modules" ] || [ -e "$dir/node_modules" ]; then
    if command -v cygpath >/dev/null 2>&1; then cmd //c rmdir "$(cygpath -w "$dir/node_modules")"; else rm "$dir/node_modules"; fi
  fi
  git -C "$repo" worktree remove --force "$dir"
}
trap cleanup EXIT

if command -v cygpath >/dev/null 2>&1; then
  cmd //c mklink //J "$(cygpath -w "$dir/node_modules")" "$(cygpath -w "$repo/node_modules")" >/dev/null
else
  ln -s "$repo/node_modules" "$dir/node_modules"
fi
[ -f "$repo/.env.local" ] && cp "$repo/.env.local" "$dir/"

cd "$dir"
npx tsc --noEmit -p .
npx next build
echo "buildcheck OK: $(git rev-parse --short HEAD)"
