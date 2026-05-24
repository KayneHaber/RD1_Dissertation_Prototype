/**
 * React XSS Linter
 * RD1 Milestone 2 prototype
 *
 * CLI entry point. Takes a file path, runs the scanner, prints findings.
 */

import { scanFile } from "./scanner";
import { Finding } from "./types";

function main(): void {
  const filePath: string | undefined = process.argv[2];

  if (!filePath) {
    console.log("React XSS Linter");
    console.log("Usage: npm run scan <path-to-react-file>");
    process.exit(1);
  }

  console.log(`React XSS Linter - scanning: ${filePath}\n`);

  const findings: Finding[] = scanFile(filePath);

  if (findings.length === 0) {
    console.log("No XSS issues found.");
  } else {
    findings.forEach((f) => {
      console.log(`[${f.severity}] line ${f.line}: ${f.message}`);
      console.log(`  fix: ${f.suggestion}\n`);
    });
  }
}

main();