// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FormattedDate, FormattedDateProps } from 'reports/components/formatted-date';

describe('FormattedDate', () => {
    describe('render', () => {
        test('end of last millennium', () => {
            testDate(new Date(1999, 11, 31, 23, 59, 59), '1999-12-31 11:59 PM FTZ');
        });

        test('start of this millennium', () => {
            testDate(new Date(2000, 0, 1, 0, 0, 0), '2000-01-01 12:00 AM FTZ');
        });

        function testDate(date: Date, expected: string): void {
            const dateWithFakeTimeZone = new Date(date);
            dateWithFakeTimeZone.toLocaleTimeString = () => {
                return 'blah FTZ';
            };
            const props: FormattedDateProps = {
                date: dateWithFakeTimeZone,
            };
            const testSubject = new FormattedDate(props);

            const actual = testSubject.render();

            expect(actual.props.children).toBe(expected);
            expect(actual).toMatchSnapshot();
        }
    });
});
