// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { readFileSync } from 'fs';
import { keys } from 'lodash';

describe('Reporter Dependencies', () => {
        const mainPackage = JSON.parse(readFileSync('package.json', { encoding: 'utf-8' }));
        const mainDependencies = mainPackage.dependencies;

        const reportPackage = JSON.parse(readFileSync('packages/report/package.json', { encoding: 'utf-8' }));
        const reportDependencies = reportPackage.dependencies;

        keys(reportDependencies).forEach(pkg => it(`${pkg} matches version`, () => {
            expect(reportDependencies[pkg]).toEqual(mainDependencies[pkg]);
        }));
});
