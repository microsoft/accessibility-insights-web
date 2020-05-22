// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { IMock, Mock, MockBehavior } from 'typemoq';
import { CreateIssueDetailsTextData } from '../../../../common/types/create-issue-details-text-data';
import { IssueDetailsBuilder } from '../../../../issue-filing/common/issue-details-builder';
import { IssueUrlCreationUtils } from '../../../../issue-filing/common/issue-filing-url-string-utils';

describe('Issue details text builder', () => {
    let testSubject: IssueDetailsTextGenerator;
    let sampleIssueDetailsData: CreateIssueDetailsTextData;
    let issueUrlCreationUtilsMock: IMock<IssueUrlCreationUtils>;
    let issueDetailsBuilderMock: IMock<IssueDetailsBuilder>;

    const wcagTags = ['WCAG-1.4.1', 'WCAG-2.8.2'];
    const title = `${wcagTags.join(',')}: RR-help (RR-selector<x>)`;
    const selector = 'RR-selector<x>';

    const toolData: ToolData = {
        scanEngineProperties: {
            name: 'engine-name',
            version: 'engine-version',
        },
        applicationProperties: {
            name: 'app-name',
            version: 'app-version',
            environmentName: 'environmentName',
        },
    };

    beforeEach(() => {
        sampleIssueDetailsData = {
            rule: {
                description: 'RR-help',
                id: 'RR-rule-id',
                url: 'RR-help-url',
                guidance: [{ text: wcagTags[0] }, { text: wcagTags[1] }],
            },
            targetApp: {
                name: 'pageTitle<x>',
                url: 'pageUrl',
            },
            element: {
                identifier: selector,
                conciseName: selector,
            },
            howToFixSummary: 'RR-failureSummary',
            snippet: 'RR-snippet   space',
        } as any;

        issueUrlCreationUtilsMock = Mock.ofType<IssueUrlCreationUtils>(
            undefined,
            MockBehavior.Strict,
        );
        issueUrlCreationUtilsMock
            .setup(utils => utils.getSelectorLastPart(selector))
            .returns(() => selector);
        issueUrlCreationUtilsMock
            .setup(utils => utils.getTitle(sampleIssueDetailsData))
            .returns(() => title);
        issueUrlCreationUtilsMock
            .setup(utils => utils.standardizeTags(sampleIssueDetailsData))
            .returns(() => wcagTags);

        issueDetailsBuilderMock = Mock.ofType<IssueDetailsBuilder>(undefined, MockBehavior.Strict);
        issueDetailsBuilderMock
            .setup(builder => builder(toolData, sampleIssueDetailsData))
            .returns(() => 'test-issue-details-builder');

        testSubject = new IssueDetailsTextGenerator(
            issueUrlCreationUtilsMock.object,
            issueDetailsBuilderMock.object,
        );
    });

    test('buildText', () => {
        const actual = testSubject.buildText(sampleIssueDetailsData, toolData);
        const expected = [
            `Title: ${title}`,
            `Tags: Accessibility, ${wcagTags.join(', ')}, RR-rule-id`,
            ``,
            'test-issue-details-builder',
        ].join('\n');
        expect(actual).toEqual(expected);
    });

    const noStandardTags = [];
    const oneStandardTag = ['WCAG-1.4.1'];
    const manyStandardTags = ['WCAG-1.4.1', 'WCAG-2.8.2', 'WCAG-4.1.4'];

    describe('buildTags', () => {
        test('no standard tags', () => {
            const expected = 'Accessibility, RR-rule-id';
            const actual = testSubject.buildTags(sampleIssueDetailsData, noStandardTags);

            expect(actual).toEqual(expected);
        });

        test('one standard tag', () => {
            const expected = 'Accessibility, WCAG-1.4.1, RR-rule-id';
            const actual = testSubject.buildTags(sampleIssueDetailsData, oneStandardTag);

            expect(actual).toEqual(expected);
        });

        test('many standard tags', () => {
            const expected = 'Accessibility, WCAG-1.4.1, WCAG-2.8.2, WCAG-4.1.4, RR-rule-id';
            const actual = testSubject.buildTags(sampleIssueDetailsData, manyStandardTags);

            expect(actual).toEqual(expected);
        });
    });
});
