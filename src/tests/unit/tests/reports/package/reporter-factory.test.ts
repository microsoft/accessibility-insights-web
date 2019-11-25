// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Reporter } from 'reports/package/reporter';
import { reporterFactory } from 'reports/package/reporter-factory';

describe('ReporterFactory', () => {
    it('returns a valid reporter', () => {
        const reporter = reporterFactory();

        expect(reporter).toBeInstanceOf(Reporter);
    });
});
