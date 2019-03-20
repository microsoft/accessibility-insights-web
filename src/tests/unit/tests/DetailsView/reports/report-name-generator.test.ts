// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportNameGenerator } from '../../../../../DetailsView/reports/report-name-generator';

describe('ReportNameGeneratorTest', () => {
    const theDate = new Date(Date.UTC(2019, 2, 12, 16, 0, 0));
    const dateProvider = () => theDate;
    const deps = { dateProvider };
    const testObject = new ReportNameGenerator(deps);

    it('generates an appropriate file from the current date/time', () => {
        const theBase = 'BASE';
        const theExt = 'EXT';
        const expectedFileName = 'BASE 2019-03-12 16:00:00.EXT';

        const fileName = testObject.getFileName(theBase, theExt);

        expect(fileName).toBe(expectedFileName);
    });

    test('single digit date/time elements with short title', () => {
        const date = new Date(2018, 0, 1, 2, 3);
        const title = 't';

        const actual = testObject.generateName(date, title);

        const expected = 'InsightsScan_20180101_t.html';
        expect(actual).toEqual(expected);
    });

    test('double digit date/time elements with long title', () => {
        const date = new Date(2017, 9, 10, 12, 13);
        const title = 'ThisIsALongTitleThatShouldBeTruncated';

        const actual = testObject.generateName(date, title);

        const expected = 'InsightsScan_20171010_ThisIsALongTitleThat.html';
        expect(actual).toEqual(expected);
    });

    test('maximum date/time elements with invalid title characters', () => {
        const date = new Date(2017, 11, 31, 23, 59);
        const title = '$T+i(t}l!e 1';

        const actual = testObject.generateName(date, title);

        const expected = 'InsightsScan_20171231_Title1.html';
        expect(actual).toEqual(expected);
    });
});
