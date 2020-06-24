// @ts-check
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const config = require('./config');
const { forStrictNullCheckEligibleFiles } = require('./eligible-file-finder');

const repoRoot = config.repoRoot;

const buildCompletePattern = /Found (\d+) errors?\. Watching for file changes\./gi;

forStrictNullCheckEligibleFiles(repoRoot, () => {}).then(async files => {
    const tscPath = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');
    const tsconfigPath = path.join(repoRoot, config.targetTsconfig);

    const child = child_process.spawn('node', [tscPath, '-p', tsconfigPath, '--watch']);
    for (const file of files) {
        await tryAutoAddStrictNulls(child, tsconfigPath, file);
    }
    child.kill();
});

function tryAutoAddStrictNulls(child, tsconfigPath, file) {
    return new Promise(resolve => {
        const relativeFilePath = path.relative(repoRoot, file).replace(/\\/g, '/');
        console.log(`Trying to auto add '${relativeFilePath}'`);

        const originalConfig = JSON.parse(fs.readFileSync(tsconfigPath).toString());
        originalConfig.files = Array.from(new Set(originalConfig.files.sort()));

        // Config on accept
        const newConfig = Object.assign({}, originalConfig);
        newConfig.files = Array.from(
            new Set(originalConfig.files.concat('./' + relativeFilePath).sort()),
        );

        const listener = data => {
            const textOut = data.toString();
            // console.log('  ' + textOut);
            const match = buildCompletePattern.exec(textOut);
            if (match) {
                const errorCount = +match[1];
                if (errorCount === 0) {
                    console.log(`Success`);
                    fs.writeFileSync(tsconfigPath, JSON.stringify(newConfig, null, '\t'));
                } else {
                    console.log(`Errors (x${errorCount}), skipped`);
                    fs.writeFileSync(tsconfigPath, JSON.stringify(originalConfig, null, '\t'));
                }

                child.stdout.removeListener('data', listener);
                resolve();
            }
        };
        child.stdout.on('data', listener);

        fs.writeFileSync(tsconfigPath, JSON.stringify(newConfig, null, '    '));
    });
}
