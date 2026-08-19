// pnpm-workspace.yaml deliberately excludes non-Linux native binaries (esbuild,
// rollup, lightningcss, @tailwindcss/oxide) via `overrides`, since this
// workspace deploys to Replit (linux-x64) only. That's the right call for CI,
// but it means `pnpm install` can't start the Vite dev server on Windows.
//
// This script patches around it locally, without touching the shared
// pnpm-workspace.yaml: it detects the exact resolved version of each parent
// package already in node_modules/.pnpm, fetches the matching win32-x64
// native binary with npm into a scratch dir, and copies it into place.
// Safe to re-run after every `pnpm install` (it skips packages already
// present) and a no-op on any OS other than Windows.

import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const PNPM_STORE = path.join(ROOT, "node_modules", ".pnpm");

interface Target {
  /** Store dir prefix, pnpm-encoded (`@scope+name`) for the already-installed parent package. */
  storePrefix: string;
  /** Package name of the native binary to fetch. */
  pkg: string;
  /** Path under node_modules to copy it to. */
  destRelative: string;
}

const TARGETS: Target[] = [
  { storePrefix: "rollup", pkg: "@rollup/rollup-win32-x64-msvc", destRelative: "@rollup/rollup-win32-x64-msvc" },
  { storePrefix: "esbuild", pkg: "@esbuild/win32-x64", destRelative: "@esbuild/win32-x64" },
  { storePrefix: "lightningcss", pkg: "lightningcss-win32-x64-msvc", destRelative: "lightningcss-win32-x64-msvc" },
  {
    storePrefix: "@tailwindcss+oxide",
    pkg: "@tailwindcss/oxide-win32-x64-msvc",
    destRelative: "@tailwindcss/oxide-win32-x64-msvc",
  },
];

function findResolvedVersion(storePrefix: string): string | null {
  if (!existsSync(PNPM_STORE)) return null;
  const entries = readdirSync(PNPM_STORE, { withFileTypes: true });
  const match = entries.find((e) => e.isDirectory() && e.name.startsWith(`${storePrefix}@`));
  return match ? match.name.slice(storePrefix.length + 1) : null;
}

function fetchPackage(pkg: string, version: string): string {
  const scratch = mkdtempSync(path.join(tmpdir(), "win32-native-fetch-"));
  const npmArgs = ["install", "--no-save", "--no-audit", "--no-fund", `${pkg}@${version}`];
  // On Windows, npm ships as npm.cmd, which can only be spawned through a
  // shell. Route it through cmd.exe /c explicitly (rather than
  // execFileSync(..., { shell: true })) so argv stays an untouched array
  // and nothing needs ad-hoc shell-escaping.
  if (process.platform === "win32") {
    execFileSync("cmd.exe", ["/d", "/s", "/c", "npm", ...npmArgs], { cwd: scratch, stdio: "inherit" });
  } else {
    execFileSync("npm", npmArgs, { cwd: scratch, stdio: "inherit" });
  }
  return path.join(scratch, "node_modules", pkg);
}

function main() {
  if (process.platform !== "win32") {
    console.log("fix-win32-deps: not on Windows, nothing to do.");
    return;
  }

  for (const target of TARGETS) {
    const destPath = path.join(ROOT, "node_modules", target.destRelative);
    if (existsSync(destPath)) {
      console.log(`fix-win32-deps: ${target.pkg} already present, skipping.`);
      continue;
    }

    const version = findResolvedVersion(target.storePrefix);
    if (!version) {
      console.warn(
        `fix-win32-deps: couldn't find an installed version for "${target.storePrefix}" — ` +
          `run "pnpm install" first, or this dependency may no longer be in use.`,
      );
      continue;
    }

    console.log(`fix-win32-deps: fetching ${target.pkg}@${version}...`);
    const fetchedPath = fetchPackage(target.pkg, version);
    mkdirSync(path.dirname(destPath), { recursive: true });
    cpSync(fetchedPath, destPath, { recursive: true });
    rmSync(path.dirname(fetchedPath), { recursive: true, force: true });
    console.log(`fix-win32-deps: installed ${target.pkg}@${version} -> ${path.relative(ROOT, destPath)}`);
  }

  console.log("fix-win32-deps: done.");
}

main();
