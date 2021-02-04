// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { IMock, Mock } from 'typemoq';

import { CreateIssueDetailsTextData } from '../../../../../../common/types/create-issue-details-text-data';
import { HTTPQueryBuilder } from '../../../../../../issue-filing/common/http-query-builder';
import { IssueDetailsBuilder } from '../../../../../../issue-filing/common/issue-details-builder';
import { IssueUrlCreationUtils } from '../../../../../../issue-filing/common/issue-filing-url-string-utils';
import { AzureBoardsIssueFilingSettings } from '../../../../../../issue-filing/services/azure-boards/azure-boards-issue-filing-settings';
import { createAzureBoardsIssueFilingUrlProvider } from '../../../../../../issue-filing/services/azure-boards/create-azure-boards-issue-filing-url';
import { IssueFilingUrlProvider } from '../../../../../../issue-filing/types/issue-filing-service';

describe('createAzureBoardsIssueFilingUrl', () => {
    const testIssueDetails = 'html issue details';
    let baseTags: string;

    let toolData: ToolData;
    let sampleIssueDetailsData: CreateIssueDetailsTextData;
    let settingsData: AzureBoardsIssueFilingSettings;
    let stringUtilsMock: IMock<IssueUrlCreationUtils>;
    let issueDetailsGetterMock: IMock<IssueDetailsBuilder>;
    let queryBuilderMock: IMock<HTTPQueryBuilder>;

    let testSubject: IssueFilingUrlProvider<AzureBoardsIssueFilingSettings>;

    beforeEach(() => {
        toolData = {
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
        sampleIssueDetailsData = {
            rule: {
                description: 'RR-help',
                id: 'RR-rule-id',
                url: 'RR-help-url',
                guidance: [{ text: 'WCAG-1.4.1' }, { text: 'wcag-2.8.2' }],
            } as any,
            targetApp: {
                name: 'pageTitle<x>',
                url: 'pageUrl',
            },
            element: {
                identifier: 'RR-selector<x>',
                conciseName: 'RR-selector<x>',
            },
            howToFixSummary: 'RR-failureSummary',
            snippet: 'RR-snippet   space',
        };
        settingsData = {
            projectURL: 'https://test-project-url',
            issueDetailsField: 'description',
        };

        baseTags = `Accessibility; ${toolData.applicationProperties.name}; rule: ${sampleIssueDetailsData.rule.id}`;

        stringUtilsMock = Mock.ofType<IssueUrlCreationUtils>();
        const testTitle = 'test title';
        stringUtilsMock
            .setup(utils => utils.getTitle(sampleIssueDetailsData))
            .returns(() => testTitle);

        issueDetailsGetterMock = Mock.ofType<IssueDetailsBuilder>();
        issueDetailsGetterMock
            .setup(getter => getter(toolData, sampleIssueDetailsData))
            .returns(() => testIssueDetails);

        queryBuilderMock = Mock.ofType<HTTPQueryBuilder>();

        queryBuilderMock
            .setup(builder => builder.withParam('fullScreen', 'true'))
            .returns(() => queryBuilderMock.object);
        queryBuilderMock
            .setup(builder => builder.withParam('[System.Title]', testTitle))
            .returns(() => queryBuilderMock.object);

        queryBuilderMock.setup(builder => builder.build()).returns(() => 'https://builded-url');

        testSubject = createAzureBoardsIssueFilingUrlProvider(
            stringUtilsMock.object,
            issueDetailsGetterMock.object,
            () => queryBuilderMock.object,
        );
    });

    describe('creates url', () => {
        it('uses description field, without tags', () => {
            stringUtilsMock
                .setup(utils => utils.standardizeTags(sampleIssueDetailsData))
                .returns(() => []);

            queryBuilderMock
                .setup(builder =>
                    builder.withBaseUrl(`${settingsData.projectURL}/_workitems/create/Issue`),
                )
                .returns(() => queryBuilderMock.object);
            queryBuilderMock
                .setup(builder => builder.withParam('[System.Tags]', baseTags))
                .returns(() => queryBuilderMock.object);

            queryBuilderMock
                .setup(builder => builder.withParam('[System.Description]', testIssueDetails))
                .returns(() => queryBuilderMock.object);

            const result = testSubject(settingsData, sampleIssueDetailsData, toolData);

            expect(result).toMatchSnapshot();
        });

        it('uses description field, with tags', () => {
            stringUtilsMock
                .setup(utils => utils.standardizeTags(sampleIssueDetailsData))
                .returns(() => ['TAG1', 'TAG2']);

            queryBuilderMock
                .setup(builder =>
                    builder.withBaseUrl(`${settingsData.projectURL}/_workitems/create/Issue`),
                )
                .returns(() => queryBuilderMock.object);

            const expectedTags = `${baseTags}; TAG1; TAG2`;
            queryBuilderMock
                .setup(builder => builder.withParam('[System.Tags]', expectedTags))
                .returns(() => queryBuilderMock.object);
            queryBuilderMock
                .setup(builder => builder.withParam('[System.Description]', testIssueDetails))
                .returns(() => queryBuilderMock.object);

            const result = testSubject(settingsData, sampleIssueDetailsData, toolData);

            expect(result).toMatchSnapshot();
        });

        it('uses repro steps field, without tags', () => {
            settingsData.issueDetailsField = 'reproSteps';
            stringUtilsMock
                .setup(utils => utils.standardizeTags(sampleIssueDetailsData))
                .returns(() => []);

            queryBuilderMock
                .setup(builder =>
                    builder.withBaseUrl(`${settingsData.projectURL}/_workitems/create/Bug`),
                )
                .returns(() => queryBuilderMock.object);

            queryBuilderMock
                .setup(builder => builder.withParam('[System.Tags]', baseTags))
                .returns(() => queryBuilderMock.object);
            queryBuilderMock
                .setup(builder =>
                    builder.withParam('[Microsoft.VSTS.TCM.ReproSteps]', testIssueDetails),
                )
                .returns(() => queryBuilderMock.object);

            const result = testSubject(settingsData, sampleIssueDetailsData, toolData);

            expect(result).toMatchSnapshot();
        });

        it('uses repro steps field, with tags', () => {
            settingsData.issueDetailsField = 'reproSteps';
            stringUtilsMock
                .setup(utils => utils.standardizeTags(sampleIssueDetailsData))
                .returns(() => ['TAG1', 'TAG2']);

            queryBuilderMock
                .setup(builder =>
                    builder.withBaseUrl(`${settingsData.projectURL}/_workitems/create/Bug`),
                )
                .returns(() => queryBuilderMock.object);

            const expectedTags = `${baseTags}; TAG1; TAG2`;
            queryBuilderMock
                .setup(builder => builder.withParam('[System.Tags]', expectedTags))
                .returns(() => queryBuilderMock.object);
            queryBuilderMock
                .setup(builder =>
                    builder.withParam('[Microsoft.VSTS.TCM.ReproSteps]', testIssueDetails),
                )
                .returns(() => queryBuilderMock.object);

            const result = testSubject(settingsData, sampleIssueDetailsData, toolData);

            expect(result).toMatchSnapshot();
        });
    });
});
