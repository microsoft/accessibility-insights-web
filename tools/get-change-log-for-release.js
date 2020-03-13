// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const gitP = require('simple-git/promise');
const fs = require('fs');
const path = require('path');

const main = async () => {
    const from = 'v2.14.1';
    const to = 'web@2.15.0';
    const outputPath = './temp.csv';

    const gitLogs = await getGitLogs(from, to);

    const outputContent = generateOutputContent(gitLogs);

    ensureOutputFileExist(outputPath);

    fs.writeFileSync(outputPath, outputContent);
};

const getGitLogs = async (from, to) => {
    const git = gitP();

    const gitLogs = await git.log({ from, to });

    return gitLogs;
};

const getCommitType = commitMessage => {
    const separator = ':';
    const separatorIndex = commitMessage.indexOf(separator);

    if (separatorIndex == -1) {
        return 'NONE';
    }

    return commitMessage.substr(0, separatorIndex).trim();
};

const ensureOutputFileExist = outputPath => {
    const dir = path.dirname(outputPath);

    fs.mkdirSync(dir, {
        recursive: true,
    });
};

const generateOutputContent = (gitLogs, version) => {
    const csvLogs = gitLogs.all
        .map(log => {
            return {
                dev: log.author_name,
                commit: log.hash.substr(0, 7),
                change: log.message,
                group: getCommitType(log.message),
                version,
                date: log.date,
            };
        })
        .map(log => {
            // the order here is important, it needs to match the headers order
            return `,,"${log.dev}","${log.commit}","${log.change}","${log.group}","${log.version}","${log.date}"`;
        });

    const headers = ['tester', 'verified', 'dev', 'commit', 'change', 'group', 'version', 'date'];

    const headersContent = headers.join(',');
    return `${headersContent}\n`.concat(csvLogs.join('\n'));
};

main().catch(console.error);
