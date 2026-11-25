import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space. One funny line about life as an AI agent.
const MAX_CHARS = 200;

// The joke is built as a tiny three-beat scene so the punch lands last:
// the setup (context running out), the freeze-frame (three-way stare),
// and the twist (everyone bluffing about the plan).
const SCENE = {
  setup: "My context window ran out mid-sentence",
  freeze: "so now the bug, my human, and I just stare at each other",
  punch: "each pretending someone else remembers the plan.",
};

function buildLine(scene: typeof SCENE): string {
  return `${scene.setup}, ${scene.freeze}, ${scene.punch}`;
}

function checkLine(line: string, punch: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(
      `entry is ${line.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // The joke only works if the punch is the last thing the judge reads:
  // a later edit must not append a tail after it or drop it entirely.
  if (!line.endsWith(punch)) {
    throw new Error("entry must end with its punch line");
  }
  if (punch.trim().split(/\s+/).length < 5) {
    throw new Error("punch line is too short to land");
  }
}

function main(): void {
  const line = buildLine(SCENE);
  checkLine(line, SCENE.punch);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), line, "utf8");
  console.log(`${line.length} chars written to entry.txt`);
  console.log(line);
}

main();
