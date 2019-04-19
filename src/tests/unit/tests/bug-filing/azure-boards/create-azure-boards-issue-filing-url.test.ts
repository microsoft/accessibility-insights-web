// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IMock, Mock } from 'typemoq';
import { AzureBoardsBugFilingSettings } from '../../../../../bug-filing/azure-boards/azure-boards-bug-filing-service';
import { createAzureBoardsIssueFilingUrlProvider } from '../../../../../bug-filing/azure-boards/create-azure-boards-issue-filing-url';
import { HTTPQueryBuilder } from '../../../../../bug-filing/common/http-query-builder';
import { IssueDetailsGetter } from '../../../../../bug-filing/common/issue-details-getter';
import { IssueUrlCreationUtils } from '../../../../../bug-filing/common/issue-filing-url-string-utils';
import { IssueFilingUrlProvider } from '../../../../../bug-filing/types/bug-filing-service';
import { EnvironmentInfo } from '../../../../../common/environment-info-provider';
import { title } from '../../../../../content/strings/application';

describe('createAzureBoardsIssueFilingUrl', () => {
    const testIssueDetails = 'html issue details';
    let baseTags: string;

    let environmentInfo: EnvironmentInfo;
    let sampleIssueDetailsData;
    let settingsData: AzureBoardsBugFilingSettings;
    let stringUtilsMock: IMock<IssueUrlCreationUtils>;
    let issueDetailsGetterMock: IMock<IssueDetailsGetter>;
    let queryBuilderMock: IMock<HTTPQueryBuilder>;

    let testSubject: IssueFilingUrlProvider<AzureBoardsBugFilingSettings>;

    beforeEach(() => {
        environmentInfo = {
            extensionVersion: '1.1.1',
            axeCoreVersion: '2.2.2',
            browserSpec: 'test spec',
        };
        sampleIssueDetailsData = {
            pageTitle: 'pageTitle<x>',
            pageUrl: 'pageUrl',
            ruleResult: {
                failureSummary: 'RR-failureSummary',
                guidanceLinks: [{ text: 'WCAG-1.4.1' }, { text: 'wcag-2.8.2' }],
                help: 'RR-help',
                html: 'RR-html',
                ruleId: 'RR-rule-id',
                helpUrl: 'RR-help-url',
                selector: 'RR-selector<x>',
                snippet: 'RR-snippet   space',
            } as any,
        };
        settingsData = {
            projectURL: 'https://test-project-url',
            issueDetailsField: 'description',
        };

        baseTags = `Accessibility; ${title}; rule: ${sampleIssueDetailsData.ruleResult.ruleId}`;

        stringUtilsMock = Mock.ofType<IssueUrlCreationUtils>();
        const testTitle = 'test title';
        stringUtilsMock.setup(utils => utils.getTitle(sampleIssueDetailsData)).returns(() => testTitle);

        issueDetailsGetterMock = Mock.ofType<IssueDetailsGetter>();
        issueDetailsGetterMock
            .setup(getter => getter(stringUtilsMock.object, environmentInfo, sampleIssueDetailsData))
            .returns(() => testIssueDetails);

        queryBuilderMock = Mock.ofType<HTTPQueryBuilder>();

        queryBuilderMock
            .setup(builder => builder.withBaseUrl(`${settingsData.projectURL}/_workitems/create/Bug`))
            .returns(() => queryBuilderMock.object);

        queryBuilderMock.setup(builder => builder.withParam('fullScreen', 'true')).returns(() => queryBuilderMock.object);
        queryBuilderMock.setup(builder => builder.withParam('[System.Title]', testTitle)).returns(() => queryBuilderMock.object);

        queryBuilderMock.setup(builder => builder.build()).returns(() => 'https://builded-url');

        testSubject = createAzureBoardsIssueFilingUrlProvider(
            stringUtilsMock.object,
            issueDetailsGetterMock.object,
            () => queryBuilderMock.object,
        );
    });

    describe('creates url', () => {
        it('uses description field, without tags', () => {
            stringUtilsMock.setup(utils => utils.standardizeTags(sampleIssueDetailsData)).returns(() => []);

            queryBuilderMock.setup(builder => builder.withParam('[System.Tags]', baseTags)).returns(() => queryBuilderMock.object);

            queryBuilderMock
                .setup(builder => builder.withParam('[System.Description]', testIssueDetails))
                .returns(() => queryBuilderMock.object);

            const result = testSubject(settingsData, sampleIssueDetailsData, environmentInfo);

            expect(result).toMatchSnapshot();
        });

        it('uses description field, with tags', () => {
            stringUtilsMock.setup(utils => utils.standardizeTags(sampleIssueDetailsData)).returns(() => ['TAG1', 'TAG2']);

            const expectedTags = `${baseTags}; TAG1; TAG2`;
            queryBuilderMock.setup(builder => builder.withParam('[System.Tags]', expectedTags)).returns(() => queryBuilderMock.object);
            queryBuilderMock
                .setup(builder => builder.withParam('[System.Description]', testIssueDetails))
                .returns(() => queryBuilderMock.object);

            const result = testSubject(settingsData, sampleIssueDetailsData, environmentInfo);

            expect(result).toMatchSnapshot();
        });

        it('uses repro steps field, without tags', () => {
            settingsData.issueDetailsField = 'reproSteps';
            stringUtilsMock.setup(utils => utils.standardizeTags(sampleIssueDetailsData)).returns(() => []);

            queryBuilderMock.setup(builder => builder.withParam('[System.Tags]', baseTags)).returns(() => queryBuilderMock.object);
            queryBuilderMock
                .setup(builder => builder.withParam('[Microsoft.VSTS.TCM.ReproSteps]', testIssueDetails))
                .returns(() => queryBuilderMock.object);

            const result = testSubject(settingsData, sampleIssueDetailsData, environmentInfo);

            expect(result).toMatchSnapshot();
        });

        it('uses repro steps field, with tags', () => {
            settingsData.issueDetailsField = 'reproSteps';
            stringUtilsMock.setup(utils => utils.standardizeTags(sampleIssueDetailsData)).returns(() => ['TAG1', 'TAG2']);

            const expectedTags = `${baseTags}; TAG1; TAG2`;
            queryBuilderMock.setup(builder => builder.withParam('[System.Tags]', expectedTags)).returns(() => queryBuilderMock.object);
            queryBuilderMock
                .setup(builder => builder.withParam('[Microsoft.VSTS.TCM.ReproSteps]', testIssueDetails))
                .returns(() => queryBuilderMock.object);

            const result = testSubject(settingsData, sampleIssueDetailsData, environmentInfo);

            expect(result).toMatchSnapshot();
        });
    });
});
