// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');
const commander = require('commander');
const simpleGit = require('simple-git');

const main = async () => {
    const params = parseCommandLineArguments();

    validateCommandLineArguments(params);

    const gitLogs = await getGitLogs(params.from, params.to);
    const outputContent =
        params.kind === 'csv'
            ? generateCSVContent(gitLogs, params.to)
            : generateTextContent(gitLogs);
    ensureOutputFileExist(params.output);

    fs.writeFileSync(params.output, outputContent);
};

const getGitLogs = async (from, to) => {
    const git = simpleGit();

    const gitLogs = await git.log({ from, to });

    return gitLogs;
};

const getCommitType = commitMessage => {
    const separator = ':';
    const separatorIndex = commitMessage.indexOf(separator);

    if (separatorIndex === -1) {
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

const csvEscape = original => {
    return original.replace(/"/g, '""');
};

// Best-effort; returns empty string if PR number wasn't detected at end of message
const extractPrNumber = original => {
    // Handles messages of format "some text (#123)", extracting 123 as "prNumber"
    const matches = /\(#(?<prNumber>\d+)\)$/.exec(original);
    return matches == null ? '' : matches.groups.prNumber;
};

const makePrLink = pr => {
    if (pr === '') {
        return pr;
    }

    return `=HYPERLINK("${makePrURL(pr)}", "#${pr}")`;
};

const makePrURL = pr => {
    return `https://github.com/microsoft/accessibility-insights-web/pull/${pr}`;
};

const makeCommitLink = commit => {
    return `=HYPERLINK("${makeCommitURL(commit)}", "${commit}")`;
};

const makeCommitURL = commit => {
    return `https://github.com/microsoft/accessibility-insights-web/commit/${commit}`;
};

const generateTextContent = gitLogs => {
    let outputText = '';
    gitLogs.all
        .map(log => {
            return {
                dev: log.author_name,
                pr: makePrURL(extractPrNumber(log.message)),
                change: log.message,
                group: getCommitType(log.message),
            };
        })
        .filter(log => {
            return (
                !['chore(deps-dev)'].includes(log.group) && !['dependabot[bot]'].includes(log.dev)
            );
        })
        .sort((a, b) => a.group - b.group)
        .forEach(log => {
            outputText += `[tester]\n\tdev: ${log.dev}\n\tpr: ${log.pr}\n\tgroup: ${log.group}\n\tchange: ${log.change}\n`;
        });
    return outputText;
};

const generateCSVContent = (gitLogs, version) => {
    const csvLogs = gitLogs.all
        .map(log => {
            return {
                dev: csvEscape(log.author_name),
                commit: csvEscape(makeCommitLink(log.hash.substr(0, 7))),
                pr: csvEscape(makePrLink(extractPrNumber(log.message))),
                change: csvEscape(log.message),
                group: csvEscape(getCommitType(log.message)),
                version,
                date: log.date,
            };
        })
        .map(log => {
            // the order here is important, it needs to match the headers order down below
            return `,,"${log.dev}","${log.commit}","${log.pr}","${log.change}","${log.group}","${log.version}","${log.date}"`;
        });

    // prettier-ignore
    const headers = ['tester', 'verified', 'dev', 'commit', 'pr', 'change', 'group', 'version', 'date'];

    const headersContent = headers.join(',');
    return `${headersContent}\n`.concat(csvLogs.join('\n'));
};

const parseCommandLineArguments = () => {
    const program = new commander.Command();

    program
        .requiredOption(
            '-f, --from <commit_hash or tag>',
            'Starting point to get the logs. Required.',
        )
        .requiredOption('-t, --to <commit_hash or tag>', 'Ending point to get the logs. Required.')
        .option(
            '-o, --output <output_path>',
            'Path to the output file. Default: change-log.<from>-<to>.csv',
        )
        .option(
            '-k, --kind <csv or txt>',
            'Type of desired output, csv or txt. Default: csv',
            'csv',
        )
        .parse(process.argv);

    return program.opts();
};

const validateCommandLineArguments = program => {
    const errors = [];
    if (!program.from) {
        errors.push('Missing param: from');
    }

    if (!program.to) {
        errors.push('Missing param: to');
    }

    if (!program.kind) {
        program.kind = 'csv';
    }

    if (!program.output) {
        program.output = `change-log.${program.from}-${program.to}.${program.kind}`;
    }

    if (errors.length !== 0) {
        errors.forEach(error => console.error(error));
        process.exit(1);
    }
};

main().catch(console.error);
