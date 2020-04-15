// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedReportNameGenerator } from 'electron/views/report/unified-report-name-generator';

describe('UnifiedReportNameGenerator', () => {
    it('generates single digit date/time elements', () => {
        const theBase = 'BASE';
        const theTitle = 'Title';
        const date = new Date(2018, 0, 1, 16, 8, 4);

        const testObject = new UnifiedReportNameGenerator();

        const actual = testObject.generateName(theBase, date, theTitle);

        const expected = 'BASE_20180101_160804_Title.html';
        expect(actual).toEqual(expected);
    });
});
