// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const gitP = require('simple-git/promise');
const fs = require('fs');
const path = require('path');
const commander = require('commander');

const main = async () => {
    const params = parseCommandLineArguments();

    validateCommandLineArguments(params);

    const gitLogs = await getGitLogs(params.from, params.to);

    const outputContent = generateOutputContent(gitLogs, params.to);

    ensureOutputFileExist(params.output);

    fs.writeFileSync(params.output, outputContent);
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
            // the order here is important, it needs to match the headers order down below
            return `,,"${log.dev}","${log.commit}","${log.change}","${log.group}","${log.version}","${log.date}"`;
        });

    const headers = ['tester', 'verified', 'dev', 'commit', 'change', 'group', 'version', 'date'];

    const headersContent = headers.join(',');
    return `${headersContent}\n`.concat(csvLogs.join('\n'));
};

const parseCommandLineArguments = () => {
    const program = new commander.Command();

    program
        .requiredOption('-f, --from <commit_hash>', 'starting point to get the logs')
        .requiredOption('-t, --to <commit_hash>', 'ending point to get the logs')
        .option('-o, --output <output_path>', 'path to the output file')
        .parse(process.argv);

    return program;
};

const validateCommandLineArguments = program => {
    const errors = [];

    if (!program.from) {
        errors.push('Missing param: from');
    }

    if (!program.to) {
        errors.push('Missing param: to');
    }

    if (!program.output) {
        program.output = `change-log.${program.from}-${program.to}.csv`;
    }

    if (errors.length != 0) {
        errors.forEach(error => console.error(error));
        process.exit(1);
    }
};

main().catch(console.error);
