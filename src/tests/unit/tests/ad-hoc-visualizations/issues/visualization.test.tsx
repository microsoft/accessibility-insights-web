// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssuesAdHocVisualization } from 'ad-hoc-visualizations/issues/visualization';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { DictionaryStringTo } from 'types/common-types';

describe('Issues visualization', () => {
    const testSubject = IssuesAdHocVisualization;
    const testScanIncompleteWarnings: ScanIncompleteWarningId[] = ['test-warning-id' as ScanIncompleteWarningId];

    describe('getNotificationMessages', () => {
        type TestCase = {
            selectorMap: DictionaryStringTo<any>;
            warnings: ScanIncompleteWarningId[];
        };

        describe('no issues found; no warnings found', () => {
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
                const message = testSubject.getNotificationMessage(selectorMap, null, warnings);

                expect(message).toBe('Congratulations!\n\nAutomated checks found no issues on this page.');
            });
        });

        describe('no issues found; there are warnings', () => {
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
                const message = testSubject.getNotificationMessage(selectorMap, null, warnings);

                expect(message).toBe(
                    'No automated checks issues found.\nThere are iframes in the target page. Use FastPass or Assessment to provide additional permissions.',
                );
            });
        });

        describe('issues found; no warnings found', () => {
            const testCase: TestCase = {
                selectorMap: { key: 'value' },
                warnings: [],
            };

            it('returns congrats message (with no warning)', () => {
                const message = testSubject.getNotificationMessage(testCase.selectorMap, null, testCase.warnings);

                expect(message).toBe('Automated checks found issues.');
            });
        });

        describe('issues found; warnings found', () => {
            const testCase: TestCase = {
                selectorMap: { key: 'value' },
                warnings: testScanIncompleteWarnings,
            };

            it('returns congrats message with warnings found', () => {
                const message = testSubject.getNotificationMessage(testCase.selectorMap, null, testCase.warnings);

                expect(message).toBe(
                    'Automated checks found issues.\nThere are iframes in the target page. Use FastPass or Assessment to provide additional permissions.',
                );
            });
        });
    });
});
