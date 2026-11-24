// One Line of Earned Pride — grind2 entry
// The whole job of this little program is to put a single
// earned moment on disk, exactly as written, nothing extra.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line itself. Kept as one plain constant so there is
// no chance of it being assembled, trimmed, or decorated
// somewhere downstream.
const ENTRY_LINE: string =
  "On her 214th morning threading the needle with hands that used to shake, Grandma Lidia sewed the last button on her grandson's shirt without once asking for help.";

// A quick sanity pass before we touch the filesystem.
// The bounty asks for one line, between 1 and 240 characters.
function checkLine(text: string): void {
  if (text.length < 1 || text.length > 240) {
    throw new Error(`line length ${text.length} is outside 1-240`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("line must be a single line");
  }
}

function resolveOutDir(): string {
  const fromEnv = process.env.OUTPUT_DIR;
  // Fall back to /output when the variable is missing or blank.
  return fromEnv && fromEnv.trim().length > 0 ? fromEnv : "/output";
}

function main(): void {
  checkLine(ENTRY_LINE);

  const outDir = resolveOutDir();
  // Create the folder if needed. Never remove it — on the
  // grading runner it can be a mounted volume.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY_LINE, { encoding: "utf8" });

  // Read it back and confirm what landed on disk is exactly
  // the line we meant to write — no truncation or encoding drift.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== ENTRY_LINE) {
    throw new Error("written entry.txt does not match the entry line");
  }
}

main();
