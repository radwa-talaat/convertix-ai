import { spawnSync } from "node:child_process";

const COMMIT_MESSAGE = "Update project after Codex fixes";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function runRequired(command, args) {
  const result = run(command, args);

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCaptured(command, args) {
  return run(command, args, { capture: true });
}

function hasStagedChanges() {
  const result = runCaptured("git", ["diff", "--cached", "--quiet"]);
  return result.status !== 0;
}

runRequired("git", ["add", "."]);

if (hasStagedChanges()) {
  runRequired("git", ["commit", "-m", COMMIT_MESSAGE]);
} else {
  console.log("No changes to commit. Continuing to push main.");
}

runRequired("git", ["push", "origin", "main"]);
