// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { writeTsconfigSync } = require('./write-tsconfig');

const repoRoot = config.repoRoot;

function collapseCompletedDirectories(tsconfigPath) {
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath).toString());

    const listedFiles = Array.from(new Set(tsconfigContent.files.sort()));
    const listedIncludes = Array.from(new Set(tsconfigContent.include.sort()));

    const listedDirectories = listedIncludes.map(includeToDirectory);

    const completedSet = new Set([...listedFiles, ...listedDirectories]);
    reduceCompletedSet(completedSet, './src');

    const completedPaths = Array.from(completedSet).sort();
    tsconfigContent.files = completedPaths.filter(isTsFile);
    tsconfigContent.include = completedPaths.filter(isSourceDirectory).map(directoryToInclude);

    writeTsconfigSync(tsconfigPath, tsconfigContent);
}

// convert from src/common/styles/**/* to ./src/common/styles
function includeToDirectory(include) {
    return './' + include.replace('/**/*', '');
}

// convert from ./src/common/styles to src/common/styles/**/*
function directoryToInclude(directory) {
    return directory.substring(2) + '/**/*';
}

function reduceCompletedSet(completedSet, root) {
    if (completedSet.has(root)) {
        return true;
    }
    if (!isSourceDirectory(root)) {
        return false;
    }

    const children = listRelevantChildren(root);
    let allChildrenReduced = true;
    for (const child of children) {
        const childReduced = reduceCompletedSet(completedSet, child);
        allChildrenReduced = allChildrenReduced && childReduced;
    }

    if (allChildrenReduced) {
        for (const child of children) {
            completedSet.delete(child);
        }
        completedSet.add(root);
    }
    return allChildrenReduced;
}

function isSourceDirectory(relativePath) {
    // this assumes directories don't have .s in their names, which isn't robust generally
    // but happens to be true in our repo
    const isDirectory = -1 === relativePath.indexOf('.', 1);
    return isDirectory && !relativePath.includes('__snapshots__');
}

const isTsFileRegex = /\.(ts|tsx)$/;
function isTsFile(relativePath) {
    return isTsFileRegex.test(relativePath);
}

function listRelevantChildren(relativePath) {
    const rawReaddir = fs.readdirSync(path.join(repoRoot, relativePath));
    const directories = rawReaddir.filter(isSourceDirectory);
    const tsFiles = rawReaddir.filter(isTsFile);
    return [...directories, ...tsFiles].map(name => relativePath + '/' + name);
}

module.exports = {
    collapseCompletedDirectories,
};
