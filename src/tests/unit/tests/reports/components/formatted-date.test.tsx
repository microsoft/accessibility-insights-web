// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FormattedDate, FormattedDateProps } from 'reports/components/formatted-date';
import * as moment from 'moment';

describe('FormattedDate', () => {
    describe('render', () => {
        test('end of last millennium', () => {
            var date = moment('1999-12-31T23:59:59').utcOffset(300).toDate();
            testDate(date, 'Fri Dec 31 1999 23:59:59 GMT-0500');
        });

        test('start of this millennium', () => {
            var date = moment('2000-01-01T00:00:00').utcOffset(300).toDate();
            testDate(date, 'Sat Jan 01 2000 00:00:00 GMT-0500');
        });

        function testDate(date: Date, expected: string): void {
            const props: FormattedDateProps = {
                date,
            };

            const formattedDate = new FormattedDate(props);
            const actual = formattedDate.render();

            expect(actual.props.children).toBe(expected);
            expect(actual).toMatchSnapshot();
        }
    });
});
