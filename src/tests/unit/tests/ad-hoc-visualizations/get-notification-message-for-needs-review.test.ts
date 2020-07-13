// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getNotificationMessage } from 'ad-hoc-visualizations/needs-review/get-notification-message-for-needs-review';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { DictionaryStringTo } from 'types/common-types';

describe('Needs-review -> getNotificationMessage', () => {
    const testSubject = getNotificationMessage;
    const testScanIncompleteWarnings: ScanIncompleteWarningId[] = [
        'missing-required-cross-origin-permissions',
    ];

    type TestCase = {
        selectorMap: DictionaryStringTo<any>;
        warnings: ScanIncompleteWarningId[];
    };

    describe('no instances to review found; no warnings found', () => {
        const testCases: TestCase[] = [
            {
                selectorMap: null,
                warnings: [],
            },
            {
                selectorMap: undefined,
                warnings: [],
            },
            {
                selectorMap: {},
                warnings: [],
            },
        ];

        it.each(testCases)('returns proper message (with %p)', ({ selectorMap, warnings }) => {
            const message = testSubject(selectorMap, warnings);

            expect(message).toBe(
                'Congratulations!\n\nNeeds review found no instances to review on this page.',
            );
        });
    });

    describe('no instances to review found; there are warnings', () => {
        const testCase: TestCase[] = [
            {
                selectorMap: null,
                warnings: testScanIncompleteWarnings,
            },
            {
                selectorMap: undefined,
                warnings: testScanIncompleteWarnings,
            },
            {
                selectorMap: {},
                warnings: testScanIncompleteWarnings,
            },
        ];

        it.each(testCase)('returns message with warning (with %p)', ({ selectorMap, warnings }) => {
            const message = testSubject(selectorMap, warnings);

            expect(message).toBe(
                'There are iframes in the target page. Use FastPass or Assessment to provide additional permissions.\nNo instances to review found.',
            );
        });
    });

    describe('instances to review found; no warnings found', () => {
        const testCase: TestCase = {
            selectorMap: { key: 'value' },
            warnings: [],
        };

        it('returns congrats message (with no warning)', () => {
            const message = testSubject(testCase.selectorMap, testCase.warnings);

            expect(message).toBe('Needs review found instances to review.');
        });
    });

    describe('instances to review found; warnings found', () => {
        it('returns congrats message with warnings found', () => {
            const testCase: TestCase = {
                selectorMap: { key: 'value' },
                warnings: testScanIncompleteWarnings,
            };
            const message = testSubject(testCase.selectorMap, testCase.warnings);

            expect(message).toBe(
                'There are iframes in the target page. Use FastPass or Assessment to provide additional permissions.\nNeeds review found instances to review.',
            );
        });

        it('no suffix added for unsupported warning id', () => {
            const testCase: TestCase = {
                selectorMap: { key: 'value' },
                warnings: ['unsupported-warning-id' as ScanIncompleteWarningId],
            };

            const message = testSubject(testCase.selectorMap, testCase.warnings);

            expect(message).toBe('Needs review found instances to review.');
        });
    });
});
