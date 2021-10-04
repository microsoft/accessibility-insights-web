// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { buildAssessmentJsonExportData } from 'reports/assessment-json-export-json-builder';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { IMock, Mock } from 'typemoq';

describe('Assessment JSON export builder', () => {
    const date = new Date(2021, 10, 1, 11, 5);
    const version = '2.28.0';
    const title = 'title';
    const url = 'http://url/';
    const comment = 'test user comment';
    let assessmentDataStub;

    const overviewSummaryReportModelMock: IMock<OverviewSummaryReportModel> =
        Mock.ofType<OverviewSummaryReportModel>();

    const passedDetailsDataStub = [
        {
            key: 'automated-checks',
            displayName: 'Automated checks',
            steps: [
                {
                    key: 'area-alt',
                    header: {
                        displayName: 'area-alt',
                        description: {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: ['Active <area> elements must have alternate text', ''],
                            },
                            _owner: null,
                            _store: {},
                        },
                        guidanceLinks: [
                            {
                                text: 'WCAG 1.1.1',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
                            },
                            {
                                text: 'WCAG 2.4.4',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
                            },
                            {
                                text: 'WCAG 4.1.2',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
                            },
                        ],
                        requirementType: 'assisted',
                    },
                    instances: [],
                    defaultMessageComponent: {
                        message: {
                            type: 'div',
                            key: null,
                            ref: null,
                            props: {
                                className: 'no-failure-view--PreLc',
                                children: 'No matching instances',
                            },
                            _owner: null,
                            _store: {},
                        },
                        instanceCount: 0,
                    },
                    showPassingInstances: false,
                },
                {
                    key: 'th-has-data-cells',
                    header: {
                        displayName: 'th-has-data-cells',
                        description: {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: [
                                    'All th elements and elements with role=columnheader/rowheader must have data cells they describe',
                                    '',
                                ],
                            },
                            _owner: null,
                            _store: {},
                        },
                        guidanceLinks: [
                            {
                                text: 'WCAG 1.3.1',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships',
                            },
                        ],
                        requirementType: 'assisted',
                    },
                    instances: [
                        {
                            props: [
                                {
                                    key: 'Path',
                                    value: '#enrollment',
                                },
                                {
                                    key: 'Snippet',
                                    value: '<table id="enrollment">',
                                },
                            ],
                        },
                    ],
                    defaultMessageComponent: {
                        message: {
                            type: 'div',
                            key: null,
                            ref: null,
                            props: {
                                className: 'no-failure-view--PreLc',
                                children: 'No failing instances',
                            },
                            _owner: null,
                            _store: {},
                        },
                        instanceCount: 1,
                    },
                    showPassingInstances: false,
                },
                {
                    key: 'keyboard-navigation',
                    header: {
                        displayName: 'Keyboard navigation',
                        description: {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: [
                                    'Users must be able to ',
                                    {
                                        key: null,
                                        ref: null,
                                        props: {
                                            children: 'navigate',
                                        },
                                        _owner: null,
                                        _store: {},
                                    },
                                    ' to all interactive interface components using a keyboard',
                                ],
                            },
                            _owner: null,
                            _store: {},
                        },
                        guidanceLinks: [
                            {
                                text: 'WCAG 2.1.1',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
                            },
                        ],
                        requirementType: 'manual',
                    },
                    instances: [],
                    defaultMessageComponent: {
                        message: {
                            type: 'div',
                            key: null,
                            ref: null,
                            props: {
                                className: 'no-failure-view--PreLc',
                                children: 'No matching instances',
                            },
                            _owner: null,
                            _store: {},
                        },
                        instanceCount: 0,
                    },
                    showPassingInstances: true,
                },
            ],
        },
    ];

    const section508DataStub = [
        {
            key: 'automated-checks',
            displayName: 'Automated checks',
            steps: [
                {
                    key: 'highContrastMode',
                    header: {
                        displayName: 'High contrast mode',
                        description: {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children:
                                    'Websites and web apps must honor high contrast appearance settings and functions',
                            },
                            _owner: null,
                            _store: {},
                        },
                        guidanceLinks: [
                            {
                                text: 'Section 508 - 502.2.2',
                                href: 'https://www.access-board.gov/guidelines-and-standards/communications-and-it/about-the-ict-refresh/final-rule/text-of-the-standards-and-guidelines#502-interoperability-assistive-technology',
                            },
                        ],
                        requirementType: 'manual',
                    },
                    instances: [],
                    defaultMessageComponent: {
                        message: {
                            type: 'div',
                            key: null,
                            ref: null,
                            props: {
                                className: 'no-failure-view--PreLc',
                                children: 'No matching instances',
                            },
                            _owner: null,
                            _store: {},
                        },
                        instanceCount: 0,
                    },
                    showPassingInstances: true,
                },
            ],
        },
    ];

    const incompleteDetailsDataStub = [
        {
            key: 'landmarks',
            displayName: 'Landmarks',
            steps: [
                {
                    key: 'primary-content',
                    header: {
                        displayName: 'Primary content',
                        description: {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: [
                                    'The ',
                                    {
                                        key: null,
                                        ref: null,
                                        props: {
                                            children: 'main',
                                        },
                                        _owner: null,
                                        _store: {},
                                    },
                                    " landmark must contain all of the page's primary content",
                                ],
                            },
                            _owner: null,
                            _store: {},
                        },
                        guidanceLinks: [
                            {
                                text: 'WCAG 1.3.1',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships',
                            },
                            {
                                text: 'WCAG 2.4.1',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks',
                            },
                        ],
                        requirementType: 'manual',
                    },
                    instances: [],
                    defaultMessageComponent: {
                        message: {
                            type: 'div',
                            key: null,
                            ref: null,
                            props: {
                                className: 'no-failure-view--PreLc',
                                children: 'No matching instances',
                            },
                            _owner: null,
                            _store: {},
                        },
                        instanceCount: 0,
                    },
                    showPassingInstances: true,
                },
            ],
        },
    ];

    const failedDetailsDataStub = [
        {
            key: 'automated-checks',
            displayName: 'Automated checks',
            steps: [
                {
                    key: 'label',
                    header: {
                        displayName: 'label',
                        description: {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: ['Form elements must have labels', ''],
                            },
                            _owner: null,
                            _store: {},
                        },
                        guidanceLinks: [
                            {
                                text: 'WCAG 1.3.1',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships',
                            },
                            {
                                text: 'WCAG 4.1.2',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
                            },
                        ],
                        requirementType: 'assisted',
                    },
                    instances: [
                        {
                            props: [
                                {
                                    key: 'Path',
                                    value: 'input[name="name"]',
                                },
                                {
                                    key: 'Snippet',
                                    value: '<input type="text" name="name" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%; cursor: auto;">',
                                },
                            ],
                        },
                        {
                            props: [
                                {
                                    key: 'Path',
                                    value: 'input[name="email"]',
                                },
                                {
                                    key: 'Snippet',
                                    value: '<input type="text" name="email">',
                                },
                            ],
                        },
                    ],
                    defaultMessageComponent: null,
                    showPassingInstances: false,
                },
                {
                    key: 'html-has-lang',
                    header: {
                        displayName: 'html-has-lang',
                        description: {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                                children: ['<html> element must have a lang attribute', ''],
                            },
                            _owner: null,
                            _store: {},
                        },
                        guidanceLinks: [
                            {
                                text: 'WCAG 3.1.1',
                                href: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
                            },
                        ],
                        requirementType: 'assisted',
                    },
                    instances: [
                        {
                            props: [
                                {
                                    key: 'Path',
                                    value: 'html',
                                },
                                {
                                    key: 'Snippet',
                                    value: '<html>',
                                },
                            ],
                        },
                    ],
                    defaultMessageComponent: null,
                    showPassingInstances: false,
                },
            ],
        },
    ];

    beforeEach(() => {
        assessmentDataStub = {
            summary: overviewSummaryReportModelMock.object,
            scanDetails: { url: url, targetPage: title, reportDate: date },
            passedDetailsData: [],
            failedDetailsData: [],
            incompleteDetailsData: [],
        };
    });

    test('top-level data is generated as expected', () => {
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        expect(generatedJson.url).toBe(url);
        expect(generatedJson.comment).toBe(comment);
        expect(generatedJson.title).toBe(title);
        expect(generatedJson.version).toBe(version);
        expect(generatedJson.date).toBe(date.toISOString());
    });

    test('passed details data adds to set and breaks into correct WCAG categories', () => {
        assessmentDataStub.passedDetailsData = passedDetailsDataStub;
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        expect(generatedJson.results.length).toBe(5);
    });

    test('description recursive parser gives expected results', () => {
        assessmentDataStub.passedDetailsData = passedDetailsDataStub;
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        expect(
            generatedJson.results
                .find(item => item.wcagNumber === '2.1.1')
                .requirementsPassed.find(item => item.requirementKey === 'keyboard-navigation')
                .requirementDescription,
        ).toBe(
            'Users must be able to navigate to all interactive interface components using a keyboard',
        );
    });

    test('Section 508 and other non-WCAG requirements are filtered out', () => {
        assessmentDataStub.passedDetailsData = section508DataStub;
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        expect(generatedJson.results.length).toBe(0);
    });

    test('incomplete details data adds to set and breaks into correct WCAG categories', () => {
        assessmentDataStub.incompleteDetailsData = incompleteDetailsDataStub;
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        expect(generatedJson.results.length).toBe(2);
    });

    test('item previously marked passed marks incomplete upon creation of incomplete results item', () => {
        assessmentDataStub.passedDetailsData = passedDetailsDataStub;
        assessmentDataStub.incompleteDetailsData = incompleteDetailsDataStub;
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        expect(generatedJson.results.find(item => item.wcagNumber === '1.3.1').status).toBe(
            'incomplete',
        );
    });

    test('failed details data adds to set and breaks into WCAG Categories', () => {
        assessmentDataStub.failedDetailsData = failedDetailsDataStub;
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        expect(generatedJson.results.length).toBe(3);
    });

    test('failed details data instances properly populate', () => {
        assessmentDataStub.failedDetailsData = failedDetailsDataStub;
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        expect(
            generatedJson.results
                .find(item => item.wcagNumber === '1.3.1')
                .requirementsFailed.find(item => item.requirementKey === 'label')
                .instances.find(item => item.path === 'input[name="email"]').snippet,
        ).toBe('<input type="text" name="email">');
    });

    test('failed status overrides incomplete and passed statuses', () => {
        assessmentDataStub.passedDetailsData = passedDetailsDataStub;
        assessmentDataStub.incompleteDetailsData = incompleteDetailsDataStub;
        assessmentDataStub.failedDetailsData = failedDetailsDataStub;
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        expect(generatedJson.results.find(item => item.wcagNumber === '1.3.1').status).toBe('fail');
        expect(generatedJson.results.find(item => item.wcagNumber === '4.1.2').status).toBe('fail');
    });

    test('data sorts properly after populating', () => {
        assessmentDataStub.passedDetailsData = passedDetailsDataStub;
        assessmentDataStub.incompleteDetailsData = incompleteDetailsDataStub;
        assessmentDataStub.failedDetailsData = failedDetailsDataStub;
        const generatedJson = buildAssessmentJsonExportData(comment, version, assessmentDataStub);
        let wcagNumberForCompare: string = '0.0.0';
        generatedJson.results.forEach(item => {
            expect(item.wcagNumber.localeCompare(wcagNumberForCompare)).toBe(1);
            wcagNumberForCompare = item.wcagNumber;
        });
    });
});
