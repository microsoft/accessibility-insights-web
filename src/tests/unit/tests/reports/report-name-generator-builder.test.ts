// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReportNameGeneratorBuilder } from 'reports/report-name-generator-builder';

describe('ReportNameGeneratorBuilder', () => {
    const testObject = new ReportNameGeneratorBuilder();

    it('generates single digit date', () => {
        const date = new Date(2018, 0, 1);

        const actual = testObject.getDateSegment(date);

        const expected = '20180101';
        expect(actual).toEqual(expected);
    });

    it('generates maximum date', () => {
        const date = new Date(2017, 11, 31);

        const actual = testObject.getDateSegment(date);

        const expected = '20171231';
        expect(actual).toEqual(expected);
    });

    it('generates single digit time', () => {
        const date = new Date(0, 0, 0, 0, 1, 1);

        const actual = testObject.getTimeSegment(date);

        const expected = '000101';
        expect(actual).toEqual(expected);
    });

    it('generates double digits time', () => {
        const date = new Date(0, 0, 0, 23, 11, 31);

        const actual = testObject.getTimeSegment(date);

        const expected = '231131';
        expect(actual).toEqual(expected);
    });

    it('truncates long title', () => {
        const theTitle = 'TitleTitleTitleTitleTitle';

        const actual = testObject.getTitleSegment(theTitle);

        const expected = 'TitleTitleTitleTitle';
        expect(actual).toEqual(expected);
    });

    it('excludes invalid title characters', () => {
        const theTitle = '^Tit%le&';

        const actual = testObject.getTitleSegment(theTitle);

        const expected = 'Title';
        expect(actual).toEqual(expected);
    });
});
