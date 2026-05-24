/**
 * Evaluation
 * ----------
 * Runs the scanner across every sample file and scores its accuracy
 * against the known ground truth recorded in the folder names.
 *
 * Ground truth (Option A scoring):
 *   samples/vulnerable/  -> the tool SHOULD report at least one finding
 *   samples/safe/        -> the tool should report NO findings
 *   samples/mitigated/   -> reported separately, not part of precision/recall
 *
 * For each vulnerable/safe file the result is one of:
 *   TP  vulnerable file, correctly flagged
 *   FN  vulnerable file, missed
 *   TN  safe file, correctly left alone
 *   FP  safe file, wrongly flagged
 *
 * From the TP/FP/TN/FN counts it computes precision, recall and F1.
 */

import { readdirSync } from "fs";
import { join } from "path";
import { scanFile } from "./scanner";

interface CategoryResult {
  file: string;
  expectedFindings: boolean; // true if the tool should report something
  actualFindings: number;
  outcome: "TP" | "FN" | "TN" | "FP";
}

const SAMPLES_DIR = join(__dirname, "..", "samples");

// List the .jsx files inside one sample sub-folder.
function listSamples(category: string): string[] {
  const dir = join(SAMPLES_DIR, category);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".jsx"))
    .map((f) => join(dir, f));
}

// Score one folder of samples. `expected` is whether findings are wanted.
function scoreCategory(
  category: string,
  expected: boolean
): CategoryResult[] {
  return listSamples(category).map((filePath) => {
    const findings = scanFile(filePath);
    const found = findings.length > 0;

    let outcome: CategoryResult["outcome"];
    if (expected) {
      outcome = found ? "TP" : "FN";
    } else {
      outcome = found ? "FP" : "TN";
    }

    return {
      file: `${category}/${filePath.split(/[/\\]/).pop()}`,
      expectedFindings: expected,
      actualFindings: findings.length,
      outcome,
    };
  });
}

function main(): void {
  // Precision and recall use vulnerable + safe only (Option A).
  const scored: CategoryResult[] = [
    ...scoreCategory("vulnerable", true),
    ...scoreCategory("safe", false),
  ];

  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;

  console.log("Per-file results");
  console.log("----------------");
  scored.forEach((r) => {
    console.log(
      `  ${r.outcome}  ${r.file}  (findings: ${r.actualFindings})`
    );
    if (r.outcome === "TP") tp++;
    if (r.outcome === "FP") fp++;
    if (r.outcome === "TN") tn++;
    if (r.outcome === "FN") fn++;
  });

  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 =
    precision + recall === 0
      ? 0
      : (2 * precision * recall) / (precision + recall);
  const accuracy = (tp + tn) / (tp + tn + fp + fn);

  console.log("\nConfusion matrix");
  console.log("----------------");
  console.log(`  True Positives  (TP): ${tp}`);
  console.log(`  False Negatives (FN): ${fn}`);
  console.log(`  True Negatives  (TN): ${tn}`);
  console.log(`  False Positives (FP): ${fp}`);

  console.log("\nMetrics");
  console.log("-------");
  console.log(`  Accuracy : ${(accuracy * 100).toFixed(1)}%`);
  console.log(`  Precision: ${(precision * 100).toFixed(1)}%`);
  console.log(`  Recall   : ${(recall * 100).toFixed(1)}%`);
  console.log(`  F1 score : ${f1.toFixed(3)}`);

  // Mitigated samples are reported separately (Option A: discussion only).
  console.log("\nMitigated samples (reported separately)");
  console.log("---------------------------------------");
  scoreCategory("mitigated", true).forEach((r) => {
    console.log(
      `  ${r.file}: ${r.actualFindings} finding(s) reported`
    );
  });
  console.log(
    "\nNote: mitigated samples use a flagged API but are not exploitable."
  );
  console.log(
    "They are excluded from precision/recall and discussed in the report."
  );
}

main();