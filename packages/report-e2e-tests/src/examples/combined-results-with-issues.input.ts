// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CombinedReportParameters } from 'accessibility-insights-report';

export const combinedResultsWithIssues: CombinedReportParameters = {
    serviceName: 'Mock Service Name',
    axeVersion: 'mock.axe.version',
    scanDetails: {
        basePageTitle: 'Mock base without failures or unscannables',
        baseUrl: 'https://example.com/mock-base-url',
        scanStart: new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), // Jan 2 2020, 03:04:05am
        scanComplete: new Date(Date.UTC(2020, 1, 2, 4, 4, 5)), // Jan 2 2020, 04:04:05am
        durationSeconds: 1 * 60 * 60,
    },
    userAgent: 'Mock user agent',
    results: {
        urlResults: {
            failedUrls: 3,
            passedUrls: 2,
            unscannableUrls: 1,
        },
        resultsByRule: {
            failed: [
                {
                    key: 'failed-rule-1',
                    failed: [
                        {
                            urls: ['https://url/rule-1/failure-1'],
                            elementSelector: '.rule-1-selector-1',
                            snippet: '<div>snippet 1</div>',
                            fix: 'fix failed-rule-1',
                            rule: {
                                description: 'failed-rule-1 description',
                                ruleUrl: 'https://rules/failed-rule-1',
                                ruleId: 'failed-rule-1',
                                tags: ['rule-1-tag-1', 'rule-1-tag-2'],
                            },
                        },
                        {
                            urls: ['https://url/rule-1/failure-1', 'https://url/rule1/failure-2'],
                            elementSelector: '.rule-1-selector-2',
                            snippet: '<div>snippet 2</div>',
                            fix: 'fix failed-rule-1',
                            rule: {
                                description: 'failed-rule-1 description',
                                ruleUrl: 'https://rules/failed-rule-1',
                                ruleId: 'failed-rule-1',
                                tags: ['rule-1-tag-1', 'rule-1-tag-2'],
                            },
                        },
                    ],
                },
                {
                    key: 'failed-rule-2',
                    failed: [
                        {
                            urls: ['https://url/rule2/failure1'],
                            elementSelector: '.rule-2-selector-1',
                            snippet: '<div>snippet</div>',
                            fix: 'fix failed-rule-2',
                            rule: {
                                description: 'failed-rule-2 description',
                                ruleUrl: 'https://rules/rule2/failed-rule-1',
                                ruleId: 'failed-rule-2',
                                tags: ['rule-2-tag'],
                            },
                        },
                    ],
                },
            ],
            passed: [
                {
                    description: 'Ensures <area> elements of image maps have alternate text',
                    ruleUrl:
                        'https://dequeuniversity.com/rules/axe/3.3/area-alt?application=webdriverjs',
                    ruleId: 'area-alt',
                    tags: [
                        'cat.text-alternatives',
                        'wcag2a',
                        'wcag111',
                        'section508',
                        'section508.22.a',
                    ],
                },
                {
                    description: 'Ensures aria-hidden elements do not contain focusable elements',
                    ruleUrl:
                        'https://dequeuniversity.com/rules/axe/3.3/aria-hidden-focus?application=webdriverjs',
                    ruleId: 'aria-hidden-focus',
                    tags: ['cat.name-role-value', 'wcag2a', 'wcag412', 'wcag131'],
                },
            ],
            notApplicable: [
                {
                    description: 'Ensures every ARIA input field has an accessible name',
                    ruleUrl:
                        'https://dequeuniversity.com/rules/axe/3.3/aria-input-field-name?application=webdriverjs',
                    ruleId: 'aria-input-field-name',
                    tags: ['wcag2a', 'wcag412'],
                },
                {
                    description: 'Ensures every ARIA toggle field has an accessible name',
                    ruleUrl:
                        'https://dequeuniversity.com/rules/axe/3.3/aria-toggle-field-name?application=webdriverjs',
                    ruleId: 'aria-toggle-field-name',
                    tags: ['wcag2a', 'wcag412'],
                },
                {
                    description:
                        'Ensure the autocomplete attribute is correct and suitable for the form field',
                    ruleUrl:
                        'https://dequeuniversity.com/rules/axe/3.3/autocomplete-valid?application=webdriverjs',
                    ruleId: 'autocomplete-valid',
                    tags: ['cat.forms', 'wcag21aa', 'wcag135'],
                },
            ],
        },
    },
};
