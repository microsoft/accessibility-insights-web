// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CombinedReportHtmlGenerator } from 'reports/combined-report-html-generator';

describe('CombinedReportHtmlGenerator', () => {
    let testSubject: CombinedReportHtmlGenerator;

    beforeEach(() => {
        testSubject = new CombinedReportHtmlGenerator();
    });

    it('generateHtml', () => {
        const html = testSubject.generateHtml();

        expect(html).toEqual('');
    });
});
