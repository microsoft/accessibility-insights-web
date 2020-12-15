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
    browserResolution: '1920x1080',
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
                            fix: {
                                all: [],
                                any: [
                                    {
                                        data: null,
                                        id: 'internal-link-present',
                                        impact: 'serious',
                                        message: 'No valid skip link found',
                                        relatedNodes: [],
                                    },
                                    {
                                        data: null,
                                        id: 'header-present',
                                        impact: 'serious',
                                        message: 'Page does not have a header',
                                        relatedNodes: [],
                                    },
                                    {
                                        data: null,
                                        id: 'landmark',
                                        impact: 'serious',
                                        message: 'Page does not have a landmark region',
                                        relatedNodes: [],
                                    },
                                ],
                                failureSummary:
                                    'Fix any of the following:\n  No valid skip link found\n  Page does not have a header\n  Page does not have a landmark region',
                                none: [],
                            },
                            rule: {
                                description:
                                    'Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content',
                                ruleUrl:
                                    'https://dequeuniversity.com/rules/axe/3.3/bypass?application=webdriverjs',
                                ruleId: 'bypass',
                                tags: [
                                    'cat.keyboard',
                                    'wcag2a',
                                    'wcag241',
                                    'section508',
                                    'section508.22.o',
                                ],
                            },
                        },
                        {
                            urls: ['https://url/rule-1/failure-1', 'https://url/rule1/failure-2'],
                            elementSelector: '.rule-1-selector-2',
                            snippet: '<div>snippet 2</div>',
                            fix: {
                                all: [],
                                any: [
                                    {
                                        data: null,
                                        id: 'internal-link-present',
                                        impact: 'serious',
                                        message: 'No valid skip link found',
                                        relatedNodes: [],
                                    },
                                    {
                                        data: null,
                                        id: 'header-present',
                                        impact: 'serious',
                                        message: 'Page does not have a header',
                                        relatedNodes: [],
                                    },
                                    {
                                        data: null,
                                        id: 'landmark',
                                        impact: 'serious',
                                        message: 'Page does not have a landmark region',
                                        relatedNodes: [],
                                    },
                                ],
                                failureSummary:
                                    'Fix any of the following:\n  No valid skip link found\n  Page does not have a header\n  Page does not have a landmark region',
                                none: [],
                            },
                            rule: {
                                description:
                                    'Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content',
                                ruleUrl:
                                    'https://dequeuniversity.com/rules/axe/3.3/bypass?application=webdriverjs',
                                ruleId: 'bypass',
                                tags: [
                                    'cat.keyboard',
                                    'wcag2a',
                                    'wcag241',
                                    'section508',
                                    'section508.22.o',
                                ],
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
                            fix: {
                                all: [],
                                any: [
                                    {
                                        data: {
                                            bgColor: '#e7ecd8',
                                            contrastRatio: 2.52,
                                            expectedContrastRatio: '4.5:1',
                                            fgColor: '#8a94a8',
                                            fontSize: '12.0pt (16px)',
                                            fontWeight: 'normal',
                                            missingData: null,
                                        },
                                        id: 'color-contrast',
                                        impact: 'serious',
                                        message:
                                            'Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1',
                                        relatedNodes: [
                                            {
                                                html: '<li>',
                                                target: ['#menu > li:nth-child(1)'],
                                            },
                                        ],
                                    },
                                ],
                                none: [],
                                failureSummary:
                                    'Fix any of the following:\n  Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1',
                            },
                            rule: {
                                description:
                                    'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
                                ruleUrl:
                                    'https://dequeuniversity.com/rules/axe/3.3/color-contrast?application=webdriverjs',
                                ruleId: 'color-contrast',
                                tags: ['cat.color', 'wcag2aa', 'wcag143'],
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
