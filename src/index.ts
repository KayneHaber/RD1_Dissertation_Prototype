/**
 * React XSS Linter
 * RD1 Milestone 2 prototype
 *
 * Entry point for the command-line tool. At this stage it only handles
 * the command-line argument. The scanner and detectors are added next.
 */

function main(): void {
  const filePath: string | undefined = process.argv[2];

  if (!filePath) {
    console.log("React XSS Linter");
    console.log("Usage: npm run scan <path-to-react-file>");
    process.exit(1);
  }

  console.log("React XSS Linter");
  console.log(`Target file: ${filePath}`);
  console.log("(scanner not implemented yet - this is the stage 1 scaffold)");
}

main();
