// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const { getAllCheckedFiles, getAllEligibleFiles } = require('./eligible-file-finder');

async function main() {
    const datestamp = new Date().toDateString();
    const [checkedFiles, eligibleFiles] = await Promise.all([
        getAllCheckedFiles(),
        getAllEligibleFiles(),
    ]);
    const checkedEligibleFiles = eligibleFiles.filter(f => checkedFiles.has(f));
    const doneCount = checkedEligibleFiles.length;
    const totalCount = eligibleFiles.length;
    const percentage = 100 * (doneCount / totalCount);
    const formattedPercentage = percentage.toFixed(0) + '%';

    console.log(`## Web strict-null progress\n`);
    console.log(
        `**${formattedPercentage}** complete (**${doneCount}**/${totalCount} non-test files)\n`,
    );
    console.log(
        `*Contribute at [#2869](https://github.com/microsoft/accessibility-insights-web/issues/2869). Last update: ${datestamp}*`,
    );
}

void main();
