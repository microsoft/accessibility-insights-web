// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as moment from 'moment';
import { FormattedDate, FormattedDateProps } from 'reports/components/formatted-date';

describe('FormattedDate', () => {
    describe('render', () => {
        test('end of last millennium', () => {
            const date = moment.utc('1999-12-31T23:59:59').toDate();
            testDate('en-us', date, '12/31/1999 11:59:59 PM UTC+00:00');
        });

        test('start of this millennium', () => {
            const date = moment.utc('2000-01-01T00:00:00').toDate();
            testDate('en-us', date, '01/01/2000 12:00:00 AM UTC+00:00');
        });

        test('German format', () => {
            const date = moment.utc('1999-12-31T23:59:59').toDate();
            testDate('de', date, '31.12.1999 23:59:59 UTC+00:00');
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
            expect(actual).toMatchSnapshot();
        }
    });
});
