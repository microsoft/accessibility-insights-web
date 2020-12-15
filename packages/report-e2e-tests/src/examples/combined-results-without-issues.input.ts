// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CombinedReportParameters } from 'accessibility-insights-report';

export const combinedResultsWithoutIssues: CombinedReportParameters = {
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
            failedUrls: 0,
            passedUrls: 2,
            unscannableUrls: 1,
        },
        resultsByRule: {
            failed: [],
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
