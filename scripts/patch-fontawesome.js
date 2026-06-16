/**
 * Patches @fortawesome/angular-fontawesome@5.0.0 which incorrectly imports
 * DOCUMENT from @angular/core (moved to @angular/common in Angular 15+).
 *
 * Run automatically via "postinstall" in package.json.
 */

const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '../node_modules/@fortawesome/angular-fontawesome/fesm2022/angular-fontawesome.mjs'
);

if (!fs.existsSync(target)) {
  console.log('[patch-fontawesome] File not found, skipping.');
  process.exit(0);
}

const content = fs.readFileSync(target, 'utf8');

const alreadyPatched =
  content.includes("import { DOCUMENT } from '@angular/common'") &&
  !content.includes("DOCUMENT } from '@angular/core'");

if (alreadyPatched) {
  console.log('[patch-fontawesome] Already patched, skipping.');
  process.exit(0);
}

// Remove DOCUMENT from the @angular/core import line
const patched = content
  .replace(/, DOCUMENT([^}]*)} from '@angular\/core'/, '$1} from \'@angular/core\'')
  .replace(/{ DOCUMENT, ([^}]*)} from '@angular\/core'/, '{ $1} from \'@angular/core\'')
  .replace(/import \{ DOCUMENT \} from '@angular\/core';/, '')
  .replace(
    "import { DomSanitizer } from '@angular/platform-browser';",
    "import { DOCUMENT } from '@angular/common';\nimport { DomSanitizer } from '@angular/platform-browser';"
  );

if (patched === content) {
  console.warn('[patch-fontawesome] Pattern not matched — patch may need updating.');
  process.exit(0);
}

fs.writeFileSync(target, patched, 'utf8');
console.log('[patch-fontawesome] Patched successfully.');
