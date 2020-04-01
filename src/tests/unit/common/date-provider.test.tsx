// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateProvider } from '../../../common/date-provider';

describe('DateProviderTest', () => {
    test('getDateFromTimestamp', () => {
        const timestamp = 'Thu May 30 2019 16:57:54 GMT-0700 (Pacific Daylight Time)';
        expect(DateProvider.getDateFromTimestamp(timestamp)).toEqual(new Date(timestamp));
    });

    test('getCurrentDate', () => {
        const date = DateProvider.getCurrentDate();
        expect(date.getTime()).toEqual(new Date(date).getTime());
    });

    const differentTimeZonesDates = [
        'Thu May 30 2019 16:57:54 GMT-0700 (Pacific Daylight Time)',
        'Thu May 30 2019 18:57:54 GMT-0500 (Central Standard Time)',
        'Thu May 30 2019 19:57:54 GMT-0400 (Eastern Standard Time)',
    ];
    test.each(differentTimeZonesDates)('getUTCStringFromDate', timestamp => {
        const date = new Date(timestamp);
        expect(DateProvider.getUTCStringFromDate(date)).toBe('2019-05-30 11:57 PM UTC');
    });
});
