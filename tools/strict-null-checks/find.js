// @ts-check
const path = require('path');
const { repoRoot } = require('./src/config');
const { forStrictNullCheckEligibleFiles, forEachFileInSrc } = require('./src/getStrictNullCheckEligibleFiles');
const { getImportsForFile } = require('./src/tsHelper');

const srcRoot = path.join(repoRoot, 'src');

let sort = true;
let filter;
let printDependedOnCount = true;
let includeTests = false;

if (false) { // Generate test files listing
    sort = false;
    filter = x => x.endsWith('.test.ts')
    printDependedOnCount = false;
    includeTests = true;
}

forStrictNullCheckEligibleFiles(repoRoot, () => { }, { includeTests }).then(async eligibleFiles => {
    const eligibleSet = new Set(eligibleFiles);

    const dependedOnCount = new Map(eligibleFiles.map(file => [file, 0]));

    for (const file of await forEachFileInSrc(srcRoot)) {
        if (eligibleSet.has(file)) {
            // Already added
            continue;
        }

        for (const imp of getImportsForFile(file, srcRoot)) {
            if (dependedOnCount.has(imp)) {
                dependedOnCount.set(imp, dependedOnCount.get(imp) + 1);
            }
        }
    }

    let out = Array.from(dependedOnCount.entries());
    if (filter) {
        out = out.filter(x => filter(x[0]))
    }
    if (sort) {
        out = out.sort((a, b) => b[1] - a[1]);
    }
    for (const pair of out) {
        console.log(toFormattedFilePath(pair[0]) + (printDependedOnCount ? ` — Depended on by **${pair[1]}** files` : ''));
    }
});


function toFormattedFilePath(file) {
    // return `"./${path.relative(srcRoot, file)}",`;
    return `- [ ] \`"./${path.relative(srcRoot, file)}"\``;
}