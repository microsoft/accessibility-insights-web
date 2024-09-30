// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateTime } from 'luxon';
import { FormattedDate, FormattedDateProps } from 'reports/components/formatted-date';

describe('FormattedDate', () => {
    describe('render', () => {
        test('end of last millennium', () => {
            const date = DateTime.fromISO('1999-12-31T23:59:59', { zone: 'utc' }).toJSDate();
            testDate('en-us', date, '12/31/1999, 11:59:59\u202fPM UTC');
        });

        test('start of this millennium', () => {
            const date = DateTime.fromISO('2000-01-01T00:00:00', { zone: 'utc' }).toJSDate();
            testDate('en-us', date, '1/1/2000, 12:00:00\u202fAM UTC');
        });

        (platformSupportsNonEnLocales() ? test : test.skip)('German format', () => {
            const date = DateTime.fromISO('1999-12-31T23:59:59', { zone: 'utc' }).toJSDate();
            testDate('de', date, '31.12.1999, 23:59:59 UTC');
        });

        function testDate(lang: string, date: Date, expected: string): void {
            const props: FormattedDateProps = {
                deps: {
                    globalization: {
                        languageCode: lang,
                    },
                },
                date,
            };

            const formattedDate = new FormattedDate(props);
            const actual = formattedDate.render();

            expect(actual.props.children).toBe(expected);
        }
    });

    function platformSupportsNonEnLocales(): boolean {
        // Node 14 and all modern browsers support this
        // Node 12 supports Intl (which luxon uses), but only comes with the 'en' local
        const stubDate = new Date();
        const germanFormattedDate = Intl.DateTimeFormat('de').format(stubDate);
        const englishFormattedDate = Intl.DateTimeFormat('en').format(stubDate);
        return germanFormattedDate !== englishFormattedDate;
    }
});
